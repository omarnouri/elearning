import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFicher } from '../ficher.model';
import { FicherService } from '../service/ficher.service';

@Component({
  templateUrl: './ficher-delete-dialog.component.html',
})
export class FicherDeleteDialogComponent {
  ficher?: IFicher;

  constructor(protected ficherService: FicherService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ficherService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
