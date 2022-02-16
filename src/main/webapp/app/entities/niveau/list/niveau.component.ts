import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { INiveau } from '../niveau.model';
import { NiveauService } from '../service/niveau.service';
import { NiveauDeleteDialogComponent } from '../delete/niveau-delete-dialog.component';

@Component({
  selector: 'e-niveau',
  templateUrl: './niveau.component.html',
})
export class NiveauComponent implements OnInit {
  niveaus?: INiveau[];
  isLoading = false;

  constructor(protected niveauService: NiveauService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.niveauService.query().subscribe(
      (res: HttpResponse<INiveau[]>) => {
        this.isLoading = false;
        this.niveaus = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: INiveau): number {
    return item.id!;
  }

  delete(niveau: INiveau): void {
    const modalRef = this.modalService.open(NiveauDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.niveau = niveau;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
