import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CoursDetailComponent } from './cours-detail.component';

describe('Component Tests', () => {
  describe('Cours Management Detail Component', () => {
    let comp: CoursDetailComponent;
    let fixture: ComponentFixture<CoursDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CoursDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ cours: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CoursDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CoursDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load cours on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.cours).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
