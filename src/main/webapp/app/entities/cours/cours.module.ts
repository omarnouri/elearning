import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CoursComponent } from './list/cours.component';
import { CoursDetailComponent } from './detail/cours-detail.component';
import { CoursUpdateComponent } from './update/cours-update.component';
import { CoursDeleteDialogComponent } from './delete/cours-delete-dialog.component';
import { CoursRoutingModule } from './route/cours-routing.module';

@NgModule({
  imports: [SharedModule, CoursRoutingModule],
  declarations: [CoursComponent, CoursDetailComponent, CoursUpdateComponent, CoursDeleteDialogComponent],
  entryComponents: [CoursDeleteDialogComponent],
  exports: [CoursComponent]
})
export class CoursModule {}
