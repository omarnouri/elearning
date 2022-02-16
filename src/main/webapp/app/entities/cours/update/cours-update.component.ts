import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICours, Cours } from '../cours.model';
import { CoursService } from '../service/cours.service';
import { IMatiere } from 'app/entities/matiere/matiere.model';
import { MatiereService } from 'app/entities/matiere/service/matiere.service';

@Component({
  selector: 'e-cours-update',
  templateUrl: './cours-update.component.html',
})
export class CoursUpdateComponent implements OnInit {
  isSaving = false;

  matieresSharedCollection: IMatiere[] = [];

  editForm = this.fb.group({
    id: [],
    titre: [null, [Validators.required]],
    description: [],
    dateAjout: [],
    matiere: [],
  });

  constructor(
    protected coursService: CoursService,
    protected matiereService: MatiereService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cours }) => {
      if (cours.id === undefined) {
        const today = dayjs().startOf('day');
        cours.dateAjout = today;
      }

      this.updateForm(cours);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cours = this.createFromForm();
    if (cours.id !== undefined) {
      this.subscribeToSaveResponse(this.coursService.update(cours));
    } else {
      this.subscribeToSaveResponse(this.coursService.create(cours));
    }
  }

  trackMatiereById(index: number, item: IMatiere): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICours>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(cours: ICours): void {
    this.editForm.patchValue({
      id: cours.id,
      titre: cours.titre,
      description: cours.description,
      dateAjout: cours.dateAjout ? cours.dateAjout.format(DATE_TIME_FORMAT) : null,
      matiere: cours.matiere,
    });

    this.matieresSharedCollection = this.matiereService.addMatiereToCollectionIfMissing(this.matieresSharedCollection, cours.matiere);
  }

  protected loadRelationshipsOptions(): void {
    this.matiereService
      .query()
      .pipe(map((res: HttpResponse<IMatiere[]>) => res.body ?? []))
      .pipe(
        map((matieres: IMatiere[]) => this.matiereService.addMatiereToCollectionIfMissing(matieres, this.editForm.get('matiere')!.value))
      )
      .subscribe((matieres: IMatiere[]) => (this.matieresSharedCollection = matieres));
  }

  protected createFromForm(): ICours {
    return {
      ...new Cours(),
      id: this.editForm.get(['id'])!.value,
      titre: this.editForm.get(['titre'])!.value,
      description: this.editForm.get(['description'])!.value,
      dateAjout: this.editForm.get(['dateAjout'])!.value ? dayjs(this.editForm.get(['dateAjout'])!.value, DATE_TIME_FORMAT) : undefined,
      matiere: this.editForm.get(['matiere'])!.value,
    };
  }
}
