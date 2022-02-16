import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CoursComponent } from '../list/cours.component';
import { CoursDetailComponent } from '../detail/cours-detail.component';
import { CoursUpdateComponent } from '../update/cours-update.component';
import { CoursRoutingResolveService } from './cours-routing-resolve.service';

const coursRoute: Routes = [
  {
    path: '',
    component: CoursComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CoursDetailComponent,
    resolve: {
      cours: CoursRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CoursUpdateComponent,
    resolve: {
      cours: CoursRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CoursUpdateComponent,
    resolve: {
      cours: CoursRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(coursRoute)],
  exports: [RouterModule],
})
export class CoursRoutingModule {}
