import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FormateurService } from '../service/formateur.service';

import { FormateurComponent } from './formateur.component';

describe('Component Tests', () => {
  describe('Formateur Management Component', () => {
    let comp: FormateurComponent;
    let fixture: ComponentFixture<FormateurComponent>;
    let service: FormateurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FormateurComponent],
      })
        .overrideTemplate(FormateurComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FormateurComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FormateurService);

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
      expect(comp.formateurs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
