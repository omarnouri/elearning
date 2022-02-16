import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFormateur } from '../formateur.model';

@Component({
  selector: 'e-formateur-detail',
  templateUrl: './formateur-detail.component.html',
})
export class FormateurDetailComponent implements OnInit {
  formateur: IFormateur | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formateur }) => {
      this.formateur = formateur;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
