jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EtudiantService } from '../service/etudiant.service';
import { IEtudiant, Etudiant } from '../etudiant.model';
import { INiveau } from 'app/entities/niveau/niveau.model';
import { NiveauService } from 'app/entities/niveau/service/niveau.service';

import { EtudiantUpdateComponent } from './etudiant-update.component';

describe('Component Tests', () => {
  describe('Etudiant Management Update Component', () => {
    let comp: EtudiantUpdateComponent;
    let fixture: ComponentFixture<EtudiantUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let etudiantService: EtudiantService;
    let niveauService: NiveauService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EtudiantUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EtudiantUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EtudiantUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      etudiantService = TestBed.inject(EtudiantService);
      niveauService = TestBed.inject(NiveauService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Niveau query and add missing value', () => {
        const etudiant: IEtudiant = { id: 456 };
        const niveau: INiveau = { id: 29537 };
        etudiant.niveau = niveau;

        const niveauCollection: INiveau[] = [{ id: 80158 }];
        jest.spyOn(niveauService, 'query').mockReturnValue(of(new HttpResponse({ body: niveauCollection })));
        const additionalNiveaus = [niveau];
        const expectedCollection: INiveau[] = [...additionalNiveaus, ...niveauCollection];
        jest.spyOn(niveauService, 'addNiveauToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ etudiant });
        comp.ngOnInit();

        expect(niveauService.query).toHaveBeenCalled();
        expect(niveauService.addNiveauToCollectionIfMissing).toHaveBeenCalledWith(niveauCollection, ...additionalNiveaus);
        expect(comp.niveausSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const etudiant: IEtudiant = { id: 456 };
        const niveau: INiveau = { id: 39467 };
        etudiant.niveau = niveau;

        activatedRoute.data = of({ etudiant });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(etudiant));
        expect(comp.niveausSharedCollection).toContain(niveau);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Etudiant>>();
        const etudiant = { id: 123 };
        jest.spyOn(etudiantService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ etudiant });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: etudiant }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(etudiantService.update).toHaveBeenCalledWith(etudiant);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Etudiant>>();
        const etudiant = new Etudiant();
        jest.spyOn(etudiantService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ etudiant });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: etudiant }));
        saveSubject.complete();

        // THEN
        expect(etudiantService.create).toHaveBeenCalledWith(etudiant);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Etudiant>>();
        const etudiant = { id: 123 };
        jest.spyOn(etudiantService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ etudiant });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(etudiantService.update).toHaveBeenCalledWith(etudiant);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackNiveauById', () => {
        it('Should return tracked Niveau primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackNiveauById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
