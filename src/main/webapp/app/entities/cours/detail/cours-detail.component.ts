import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICours } from '../cours.model';

@Component({
  selector: 'e-cours-detail',
  templateUrl: './cours-detail.component.html',
})
export class CoursDetailComponent implements OnInit {
  cours: ICours | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cours }) => {
      this.cours = cours;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
