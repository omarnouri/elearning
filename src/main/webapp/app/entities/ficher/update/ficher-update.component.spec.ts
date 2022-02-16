jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FicherService } from '../service/ficher.service';
import { IFicher, Ficher } from '../ficher.model';
import { ICours } from 'app/entities/cours/cours.model';
import { CoursService } from 'app/entities/cours/service/cours.service';

import { FicherUpdateComponent } from './ficher-update.component';

describe('Component Tests', () => {
  describe('Ficher Management Update Component', () => {
    let comp: FicherUpdateComponent;
    let fixture: ComponentFixture<FicherUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ficherService: FicherService;
    let coursService: CoursService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FicherUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FicherUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FicherUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ficherService = TestBed.inject(FicherService);
      coursService = TestBed.inject(CoursService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Cours query and add missing value', () => {
        const ficher: IFicher = { id: 456 };
        const cours: ICours = { id: 33271 };
        ficher.cours = cours;

        const coursCollection: ICours[] = [{ id: 28180 }];
        jest.spyOn(coursService, 'query').mockReturnValue(of(new HttpResponse({ body: coursCollection })));
        const additionalCours = [cours];
        const expectedCollection: ICours[] = [...additionalCours, ...coursCollection];
        jest.spyOn(coursService, 'addCoursToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ ficher });
        comp.ngOnInit();

        expect(coursService.query).toHaveBeenCalled();
        expect(coursService.addCoursToCollectionIfMissing).toHaveBeenCalledWith(coursCollection, ...additionalCours);
        expect(comp.coursSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const ficher: IFicher = { id: 456 };
        const cours: ICours = { id: 28506 };
        ficher.cours = cours;

        activatedRoute.data = of({ ficher });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(ficher));
        expect(comp.coursSharedCollection).toContain(cours);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Ficher>>();
        const ficher = { id: 123 };
        jest.spyOn(ficherService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ ficher });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ficher }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ficherService.update).toHaveBeenCalledWith(ficher);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Ficher>>();
        const ficher = new Ficher();
        jest.spyOn(ficherService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ ficher });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ficher }));
        saveSubject.complete();

        // THEN
        expect(ficherService.create).toHaveBeenCalledWith(ficher);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Ficher>>();
        const ficher = { id: 123 };
        jest.spyOn(ficherService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ ficher });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ficherService.update).toHaveBeenCalledWith(ficher);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCoursById', () => {
        it('Should return tracked Cours primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCoursById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
