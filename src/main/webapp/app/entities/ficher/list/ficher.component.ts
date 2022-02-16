import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFicher } from '../ficher.model';
import { FicherService } from '../service/ficher.service';
import { FicherDeleteDialogComponent } from '../delete/ficher-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'e-ficher',
  templateUrl: './ficher.component.html',
})
export class FicherComponent implements OnInit {
  fichers?: IFicher[];
  isLoading = false;

  constructor(protected ficherService: FicherService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ficherService.query().subscribe(
      (res: HttpResponse<IFicher[]>) => {
        this.isLoading = false;
        this.fichers = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFicher): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(ficher: IFicher): void {
    const modalRef = this.modalService.open(FicherDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ficher = ficher;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
