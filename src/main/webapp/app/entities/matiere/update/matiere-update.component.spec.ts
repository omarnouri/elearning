jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MatiereService } from '../service/matiere.service';
import { IMatiere, Matiere } from '../matiere.model';
import { IFormateur } from 'app/entities/formateur/formateur.model';
import { FormateurService } from 'app/entities/formateur/service/formateur.service';
import { INiveau } from 'app/entities/niveau/niveau.model';
import { NiveauService } from 'app/entities/niveau/service/niveau.service';

import { MatiereUpdateComponent } from './matiere-update.component';

describe('Component Tests', () => {
  describe('Matiere Management Update Component', () => {
    let comp: MatiereUpdateComponent;
    let fixture: ComponentFixture<MatiereUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let matiereService: MatiereService;
    let formateurService: FormateurService;
    let niveauService: NiveauService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MatiereUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MatiereUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MatiereUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      matiereService = TestBed.inject(MatiereService);
      formateurService = TestBed.inject(FormateurService);
      niveauService = TestBed.inject(NiveauService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Formateur query and add missing value', () => {
        const matiere: IMatiere = { id: 456 };
        const formateur: IFormateur = { id: 90270 };
        matiere.formateur = formateur;

        const formateurCollection: IFormateur[] = [{ id: 9342 }];
        jest.spyOn(formateurService, 'query').mockReturnValue(of(new HttpResponse({ body: formateurCollection })));
        const additionalFormateurs = [formateur];
        const expectedCollection: IFormateur[] = [...additionalFormateurs, ...formateurCollection];
        jest.spyOn(formateurService, 'addFormateurToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ matiere });
        comp.ngOnInit();

        expect(formateurService.query).toHaveBeenCalled();
        expect(formateurService.addFormateurToCollectionIfMissing).toHaveBeenCalledWith(formateurCollection, ...additionalFormateurs);
        expect(comp.formateursSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Niveau query and add missing value', () => {
        const matiere: IMatiere = { id: 456 };
        const niveau: INiveau = { id: 15839 };
        matiere.niveau = niveau;

        const niveauCollection: INiveau[] = [{ id: 23276 }];
        jest.spyOn(niveauService, 'query').mockReturnValue(of(new HttpResponse({ body: niveauCollection })));
        const additionalNiveaus = [niveau];
        const expectedCollection: INiveau[] = [...additionalNiveaus, ...niveauCollection];
        jest.spyOn(niveauService, 'addNiveauToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ matiere });
        comp.ngOnInit();

        expect(niveauService.query).toHaveBeenCalled();
        expect(niveauService.addNiveauToCollectionIfMissing).toHaveBeenCalledWith(niveauCollection, ...additionalNiveaus);
        expect(comp.niveausSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const matiere: IMatiere = { id: 456 };
        const formateur: IFormateur = { id: 28749 };
        matiere.formateur = formateur;
        const niveau: INiveau = { id: 63859 };
        matiere.niveau = niveau;

        activatedRoute.data = of({ matiere });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(matiere));
        expect(comp.formateursSharedCollection).toContain(formateur);
        expect(comp.niveausSharedCollection).toContain(niveau);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Matiere>>();
        const matiere = { id: 123 };
        jest.spyOn(matiereService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ matiere });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: matiere }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(matiereService.update).toHaveBeenCalledWith(matiere);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Matiere>>();
        const matiere = new Matiere();
        jest.spyOn(matiereService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ matiere });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: matiere }));
        saveSubject.complete();

        // THEN
        expect(matiereService.create).toHaveBeenCalledWith(matiere);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Matiere>>();
        const matiere = { id: 123 };
        jest.spyOn(matiereService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ matiere });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(matiereService.update).toHaveBeenCalledWith(matiere);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackFormateurById', () => {
        it('Should return tracked Formateur primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackFormateurById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

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
