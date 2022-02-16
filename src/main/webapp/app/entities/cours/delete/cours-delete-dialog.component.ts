import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICours } from '../cours.model';
import { CoursService } from '../service/cours.service';

@Component({
  templateUrl: './cours-delete-dialog.component.html',
})
export class CoursDeleteDialogComponent {
  cours?: ICours;

  constructor(protected coursService: CoursService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.coursService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
