import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FicherComponent } from './list/ficher.component';
import { FicherDetailComponent } from './detail/ficher-detail.component';
import { FicherUpdateComponent } from './update/ficher-update.component';
import { FicherDeleteDialogComponent } from './delete/ficher-delete-dialog.component';
import { FicherRoutingModule } from './route/ficher-routing.module';

@NgModule({
  imports: [SharedModule, FicherRoutingModule],
  declarations: [FicherComponent, FicherDetailComponent, FicherUpdateComponent, FicherDeleteDialogComponent],
  entryComponents: [FicherDeleteDialogComponent],
})
export class FicherModule {}
