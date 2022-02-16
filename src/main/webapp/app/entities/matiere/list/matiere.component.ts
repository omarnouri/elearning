import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMatiere } from '../matiere.model';
import { MatiereService } from '../service/matiere.service';
import { MatiereDeleteDialogComponent } from '../delete/matiere-delete-dialog.component';

@Component({
  selector: 'e-matiere',
  templateUrl: './matiere.component.html',
})
export class MatiereComponent implements OnInit {
  matieres?: IMatiere[];
  isLoading = false;

  constructor(protected matiereService: MatiereService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.matiereService.query().subscribe(
      (res: HttpResponse<IMatiere[]>) => {
        this.isLoading = false;
        this.matieres = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMatiere): number {
    return item.id!;
  }

  delete(matiere: IMatiere): void {
    const modalRef = this.modalService.open(MatiereDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.matiere = matiere;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
