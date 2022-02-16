import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MatiereService } from '../service/matiere.service';

import { MatiereComponent } from './matiere.component';

describe('Component Tests', () => {
  describe('Matiere Management Component', () => {
    let comp: MatiereComponent;
    let fixture: ComponentFixture<MatiereComponent>;
    let service: MatiereService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MatiereComponent],
      })
        .overrideTemplate(MatiereComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MatiereComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MatiereService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.matieres?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
