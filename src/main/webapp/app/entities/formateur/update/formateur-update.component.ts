import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IFormateur, Formateur } from '../formateur.model';
import { FormateurService } from '../service/formateur.service';

@Component({
  selector: 'e-formateur-update',
  templateUrl: './formateur-update.component.html',
})
export class FormateurUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    prenom: [null, [Validators.required]],
  });

  constructor(protected formateurService: FormateurService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formateur }) => {
      this.updateForm(formateur);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const formateur = this.createFromForm();
    if (formateur.id !== undefined) {
      this.subscribeToSaveResponse(this.formateurService.update(formateur));
    } else {
      this.subscribeToSaveResponse(this.formateurService.create(formateur));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFormateur>>): void {
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

  protected updateForm(formateur: IFormateur): void {
    this.editForm.patchValue({
      id: formateur.id,
      nom: formateur.nom,
      prenom: formateur.prenom,
    });
  }

  protected createFromForm(): IFormateur {
    return {
      ...new Formateur(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
    };
  }
}
