import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CoursService } from '../service/cours.service';

import { CoursComponent } from './cours.component';

describe('Component Tests', () => {
  describe('Cours Management Component', () => {
    let comp: CoursComponent;
    let fixture: ComponentFixture<CoursComponent>;
    let service: CoursService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CoursComponent],
      })
        .overrideTemplate(CoursComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CoursComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CoursService);

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
      expect(comp.cours?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
