import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFicher, Ficher } from '../ficher.model';
import { FicherService } from '../service/ficher.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ICours } from 'app/entities/cours/cours.model';
import { CoursService } from 'app/entities/cours/service/cours.service';

@Component({
  selector: 'e-ficher-update',
  templateUrl: './ficher-update.component.html',
})
export class FicherUpdateComponent implements OnInit {
  isSaving = false;

  coursSharedCollection: ICours[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    file: [],
    fileContentType: [],
    cours: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected ficherService: FicherService,
    protected coursService: CoursService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ficher }) => {
      this.updateForm(ficher);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('eLearningApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ficher = this.createFromForm();
    if (ficher.id !== undefined) {
      this.subscribeToSaveResponse(this.ficherService.update(ficher));
    } else {
      this.subscribeToSaveResponse(this.ficherService.create(ficher));
    }
  }

  trackCoursById(index: number, item: ICours): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFicher>>): void {
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

  protected updateForm(ficher: IFicher): void {
    this.editForm.patchValue({
      id: ficher.id,
      nom: ficher.nom,
      file: ficher.file,
      fileContentType: ficher.fileContentType,
      cours: ficher.cours,
    });

    this.coursSharedCollection = this.coursService.addCoursToCollectionIfMissing(this.coursSharedCollection, ficher.cours);
  }

  protected loadRelationshipsOptions(): void {
    this.coursService
      .query()
      .pipe(map((res: HttpResponse<ICours[]>) => res.body ?? []))
      .pipe(map((cours: ICours[]) => this.coursService.addCoursToCollectionIfMissing(cours, this.editForm.get('cours')!.value)))
      .subscribe((cours: ICours[]) => (this.coursSharedCollection = cours));
  }

  protected createFromForm(): IFicher {
    return {
      ...new Ficher(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      fileContentType: this.editForm.get(['fileContentType'])!.value,
      file: this.editForm.get(['file'])!.value,
      cours: this.editForm.get(['cours'])!.value,
    };
  }
}
