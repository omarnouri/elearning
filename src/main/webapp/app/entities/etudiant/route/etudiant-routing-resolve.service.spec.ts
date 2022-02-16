jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEtudiant, Etudiant } from '../etudiant.model';
import { EtudiantService } from '../service/etudiant.service';

import { EtudiantRoutingResolveService } from './etudiant-routing-resolve.service';

describe('Service Tests', () => {
  describe('Etudiant routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: EtudiantRoutingResolveService;
    let service: EtudiantService;
    let resultEtudiant: IEtudiant | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(EtudiantRoutingResolveService);
      service = TestBed.inject(EtudiantService);
      resultEtudiant = undefined;
    });

    describe('resolve', () => {
      it('should return IEtudiant returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEtudiant = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEtudiant).toEqual({ id: 123 });
      });

      it('should return new IEtudiant if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEtudiant = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultEtudiant).toEqual(new Etudiant());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Etudiant })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEtudiant = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEtudiant).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
