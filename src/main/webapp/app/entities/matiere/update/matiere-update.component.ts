import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMatiere, Matiere } from '../matiere.model';
import { MatiereService } from '../service/matiere.service';
import { IFormateur } from 'app/entities/formateur/formateur.model';
import { FormateurService } from 'app/entities/formateur/service/formateur.service';
import { INiveau } from 'app/entities/niveau/niveau.model';
import { NiveauService } from 'app/entities/niveau/service/niveau.service';

@Component({
  selector: 'e-matiere-update',
  templateUrl: './matiere-update.component.html',
})
export class MatiereUpdateComponent implements OnInit {
  isSaving = false;

  formateursSharedCollection: IFormateur[] = [];
  niveausSharedCollection: INiveau[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    description: [],
    formateur: [],
    niveau: [],
  });

  constructor(
    protected matiereService: MatiereService,
    protected formateurService: FormateurService,
    protected niveauService: NiveauService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ matiere }) => {
      this.updateForm(matiere);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const matiere = this.createFromForm();
    if (matiere.id !== undefined) {
      this.subscribeToSaveResponse(this.matiereService.update(matiere));
    } else {
      this.subscribeToSaveResponse(this.matiereService.create(matiere));
    }
  }

  trackFormateurById(index: number, item: IFormateur): number {
    return item.id!;
  }

  trackNiveauById(index: number, item: INiveau): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMatiere>>): void {
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

  protected updateForm(matiere: IMatiere): void {
    this.editForm.patchValue({
      id: matiere.id,
      nom: matiere.nom,
      description: matiere.description,
      formateur: matiere.formateur,
      niveau: matiere.niveau,
    });

    this.formateursSharedCollection = this.formateurService.addFormateurToCollectionIfMissing(
      this.formateursSharedCollection,
      matiere.formateur
    );
    this.niveausSharedCollection = this.niveauService.addNiveauToCollectionIfMissing(this.niveausSharedCollection, matiere.niveau);
  }

  protected loadRelationshipsOptions(): void {
    this.formateurService
      .query()
      .pipe(map((res: HttpResponse<IFormateur[]>) => res.body ?? []))
      .pipe(
        map((formateurs: IFormateur[]) =>
          this.formateurService.addFormateurToCollectionIfMissing(formateurs, this.editForm.get('formateur')!.value)
        )
      )
      .subscribe((formateurs: IFormateur[]) => (this.formateursSharedCollection = formateurs));

    this.niveauService
      .query()
      .pipe(map((res: HttpResponse<INiveau[]>) => res.body ?? []))
      .pipe(map((niveaus: INiveau[]) => this.niveauService.addNiveauToCollectionIfMissing(niveaus, this.editForm.get('niveau')!.value)))
      .subscribe((niveaus: INiveau[]) => (this.niveausSharedCollection = niveaus));
  }

  protected createFromForm(): IMatiere {
    return {
      ...new Matiere(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      description: this.editForm.get(['description'])!.value,
      formateur: this.editForm.get(['formateur'])!.value,
      niveau: this.editForm.get(['niveau'])!.value,
    };
  }
}
