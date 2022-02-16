import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFicher, Ficher } from '../ficher.model';
import { FicherService } from '../service/ficher.service';

@Injectable({ providedIn: 'root' })
export class FicherRoutingResolveService implements Resolve<IFicher> {
  constructor(protected service: FicherService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFicher> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ficher: HttpResponse<Ficher>) => {
          if (ficher.body) {
            return of(ficher.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Ficher());
  }
}
