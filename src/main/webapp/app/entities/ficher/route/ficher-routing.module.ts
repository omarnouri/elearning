import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FicherComponent } from '../list/ficher.component';
import { FicherDetailComponent } from '../detail/ficher-detail.component';
import { FicherUpdateComponent } from '../update/ficher-update.component';
import { FicherRoutingResolveService } from './ficher-routing-resolve.service';

const ficherRoute: Routes = [
  {
    path: '',
    component: FicherComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FicherDetailComponent,
    resolve: {
      ficher: FicherRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FicherUpdateComponent,
    resolve: {
      ficher: FicherRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FicherUpdateComponent,
    resolve: {
      ficher: FicherRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ficherRoute)],
  exports: [RouterModule],
})
export class FicherRoutingModule {}
