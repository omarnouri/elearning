import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormateur } from '../formateur.model';
import { FormateurService } from '../service/formateur.service';
import { FormateurDeleteDialogComponent } from '../delete/formateur-delete-dialog.component';

@Component({
  selector: 'e-formateur',
  templateUrl: './formateur.component.html',
})
export class FormateurComponent implements OnInit {
  formateurs?: IFormateur[];
  isLoading = false;

  constructor(protected formateurService: FormateurService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.formateurService.query().subscribe(
      (res: HttpResponse<IFormateur[]>) => {
        this.isLoading = false;
        this.formateurs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFormateur): number {
    return item.id!;
  }

  delete(formateur: IFormateur): void {
    const modalRef = this.modalService.open(FormateurDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.formateur = formateur;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
