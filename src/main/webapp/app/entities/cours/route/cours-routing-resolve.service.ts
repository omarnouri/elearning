import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICours, Cours } from '../cours.model';
import { CoursService } from '../service/cours.service';

@Injectable({ providedIn: 'root' })
export class CoursRoutingResolveService implements Resolve<ICours> {
  constructor(protected service: CoursService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICours> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cours: HttpResponse<Cours>) => {
          if (cours.body) {
            return of(cours.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Cours());
  }
}
