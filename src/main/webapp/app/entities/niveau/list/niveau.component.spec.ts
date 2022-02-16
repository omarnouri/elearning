import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { NiveauService } from '../service/niveau.service';

import { NiveauComponent } from './niveau.component';

describe('Component Tests', () => {
  describe('Niveau Management Component', () => {
    let comp: NiveauComponent;
    let fixture: ComponentFixture<NiveauComponent>;
    let service: NiveauService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [NiveauComponent],
      })
        .overrideTemplate(NiveauComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(NiveauComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(NiveauService);

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
      expect(comp.niveaus?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
