import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICours } from '../cours.model';
import { CoursService } from '../service/cours.service';
import { CoursDeleteDialogComponent } from '../delete/cours-delete-dialog.component';

@Component({
  selector: 'e-cours',
  templateUrl: './cours.component.html',
})
export class CoursComponent implements OnInit, OnChanges {
  cours?: ICours[]  | undefined;
  isLoading = false;
  @Input()  idMatiere!: number | undefined;

  constructor(protected coursService: CoursService, protected modalService: NgbModal) {}
  ngOnChanges(changes: SimpleChanges): void {
    if(this.idMatiere) {
      this.cours = this.cours?.filter(el => el.matiere?.id === this.idMatiere)
    }
  }

  loadAll(): void {
    this.isLoading = true;

    this.coursService.query().subscribe(
      (res: HttpResponse<ICours[]>) => {
        this.isLoading = false;
        this.cours = res.body ?? [];
        if(this.idMatiere) {
          this.cours = this.cours.filter(el => el.matiere?.id === this.idMatiere)
        }
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICours): number {
    return item.id!;
  }

  delete(cours: ICours): void {
    const modalRef = this.modalService.open(CoursDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cours = cours;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
