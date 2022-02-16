jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CoursService } from '../service/cours.service';
import { ICours, Cours } from '../cours.model';
import { IMatiere } from 'app/entities/matiere/matiere.model';
import { MatiereService } from 'app/entities/matiere/service/matiere.service';

import { CoursUpdateComponent } from './cours-update.component';

describe('Component Tests', () => {
  describe('Cours Management Update Component', () => {
    let comp: CoursUpdateComponent;
    let fixture: ComponentFixture<CoursUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let coursService: CoursService;
    let matiereService: MatiereService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CoursUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CoursUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CoursUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      coursService = TestBed.inject(CoursService);
      matiereService = TestBed.inject(MatiereService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Matiere query and add missing value', () => {
        const cours: ICours = { id: 456 };
        const matiere: IMatiere = { id: 90081 };
        cours.matiere = matiere;

        const matiereCollection: IMatiere[] = [{ id: 76279 }];
        jest.spyOn(matiereService, 'query').mockReturnValue(of(new HttpResponse({ body: matiereCollection })));
        const additionalMatieres = [matiere];
        const expectedCollection: IMatiere[] = [...additionalMatieres, ...matiereCollection];
        jest.spyOn(matiereService, 'addMatiereToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ cours });
        comp.ngOnInit();

        expect(matiereService.query).toHaveBeenCalled();
        expect(matiereService.addMatiereToCollectionIfMissing).toHaveBeenCalledWith(matiereCollection, ...additionalMatieres);
        expect(comp.matieresSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const cours: ICours = { id: 456 };
        const matiere: IMatiere = { id: 25455 };
        cours.matiere = matiere;

        activatedRoute.data = of({ cours });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(cours));
        expect(comp.matieresSharedCollection).toContain(matiere);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Cours>>();
        const cours = { id: 123 };
        jest.spyOn(coursService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ cours });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cours }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(coursService.update).toHaveBeenCalledWith(cours);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Cours>>();
        const cours = new Cours();
        jest.spyOn(coursService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ cours });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cours }));
        saveSubject.complete();

        // THEN
        expect(coursService.create).toHaveBeenCalledWith(cours);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Cours>>();
        const cours = { id: 123 };
        jest.spyOn(coursService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ cours });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(coursService.update).toHaveBeenCalledWith(cours);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackMatiereById', () => {
        it('Should return tracked Matiere primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMatiereById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
