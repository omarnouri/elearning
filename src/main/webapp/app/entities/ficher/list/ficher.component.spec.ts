import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FicherService } from '../service/ficher.service';

import { FicherComponent } from './ficher.component';

describe('Component Tests', () => {
  describe('Ficher Management Component', () => {
    let comp: FicherComponent;
    let fixture: ComponentFixture<FicherComponent>;
    let service: FicherService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FicherComponent],
      })
        .overrideTemplate(FicherComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FicherComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FicherService);

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
      expect(comp.fichers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
