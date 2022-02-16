import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataUtils } from 'app/core/util/data-util.service';
import { IFicher } from 'app/entities/ficher/ficher.model';
import { FicherService } from 'app/entities/ficher/service/ficher.service';

import { ICours } from '../cours.model';

@Component({
  selector: 'e-cours-detail',
  templateUrl: './cours-detail.component.html',
})
export class CoursDetailComponent implements OnInit {
  cours: ICours | null = null;
  fichers: IFicher[] | null = null;
  constructor(protected activatedRoute: ActivatedRoute, protected ficherService: FicherService, protected dataUtils: DataUtils) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cours }) => {
      this.cours = cours;
      this.ficherService.query().subscribe(
        (res: HttpResponse<IFicher[]>) => {
          this.fichers = res.body ?? [];
          this.fichers = this.fichers.filter(el => el.cours?.id === cours.id);
          console.log(this.fichers)
        }
      );
    });
  }

  openFile(base64String: string | null | undefined, contentType: string | null | undefined): void {
    if(!base64String) {
      return;
    }
    this.dataUtils.openFile(base64String, contentType);
  }
  previousState(): void {
    window.history.back();
  }
}
