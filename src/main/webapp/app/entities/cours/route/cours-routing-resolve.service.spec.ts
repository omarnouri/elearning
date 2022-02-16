jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICours, Cours } from '../cours.model';
import { CoursService } from '../service/cours.service';

import { CoursRoutingResolveService } from './cours-routing-resolve.service';

describe('Service Tests', () => {
  describe('Cours routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CoursRoutingResolveService;
    let service: CoursService;
    let resultCours: ICours | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CoursRoutingResolveService);
      service = TestBed.inject(CoursService);
      resultCours = undefined;
    });

    describe('resolve', () => {
      it('should return ICours returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCours = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCours).toEqual({ id: 123 });
      });

      it('should return new ICours if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCours = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCours).toEqual(new Cours());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Cours })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCours = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCours).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
