jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMatiere, Matiere } from '../matiere.model';
import { MatiereService } from '../service/matiere.service';

import { MatiereRoutingResolveService } from './matiere-routing-resolve.service';

describe('Service Tests', () => {
  describe('Matiere routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: MatiereRoutingResolveService;
    let service: MatiereService;
    let resultMatiere: IMatiere | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(MatiereRoutingResolveService);
      service = TestBed.inject(MatiereService);
      resultMatiere = undefined;
    });

    describe('resolve', () => {
      it('should return IMatiere returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMatiere = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMatiere).toEqual({ id: 123 });
      });

      it('should return new IMatiere if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMatiere = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultMatiere).toEqual(new Matiere());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Matiere })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMatiere = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMatiere).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
