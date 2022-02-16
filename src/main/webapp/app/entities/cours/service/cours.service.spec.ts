import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICours, Cours } from '../cours.model';

import { CoursService } from './cours.service';

describe('Service Tests', () => {
  describe('Cours Service', () => {
    let service: CoursService;
    let httpMock: HttpTestingController;
    let elemDefault: ICours;
    let expectedResult: ICours | ICours[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CoursService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        titre: 'AAAAAAA',
        description: 'AAAAAAA',
        dateAjout: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateAjout: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Cours', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateAjout: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateAjout: currentDate,
          },
          returnedFromService
        );

        service.create(new Cours()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Cours', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            titre: 'BBBBBB',
            description: 'BBBBBB',
            dateAjout: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateAjout: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Cours', () => {
        const patchObject = Object.assign(
          {
            titre: 'BBBBBB',
          },
          new Cours()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateAjout: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Cours', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            titre: 'BBBBBB',
            description: 'BBBBBB',
            dateAjout: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateAjout: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Cours', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCoursToCollectionIfMissing', () => {
        it('should add a Cours to an empty array', () => {
          const cours: ICours = { id: 123 };
          expectedResult = service.addCoursToCollectionIfMissing([], cours);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(cours);
        });

        it('should not add a Cours to an array that contains it', () => {
          const cours: ICours = { id: 123 };
          const coursCollection: ICours[] = [
            {
              ...cours,
            },
            { id: 456 },
          ];
          expectedResult = service.addCoursToCollectionIfMissing(coursCollection, cours);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Cours to an array that doesn't contain it", () => {
          const cours: ICours = { id: 123 };
          const coursCollection: ICours[] = [{ id: 456 }];
          expectedResult = service.addCoursToCollectionIfMissing(coursCollection, cours);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(cours);
        });

        it('should add only unique Cours to an array', () => {
          const coursArray: ICours[] = [{ id: 123 }, { id: 456 }, { id: 17587 }];
          const coursCollection: ICours[] = [{ id: 123 }];
          expectedResult = service.addCoursToCollectionIfMissing(coursCollection, ...coursArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const cours: ICours = { id: 123 };
          const cours2: ICours = { id: 456 };
          expectedResult = service.addCoursToCollectionIfMissing([], cours, cours2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(cours);
          expect(expectedResult).toContain(cours2);
        });

        it('should accept null and undefined values', () => {
          const cours: ICours = { id: 123 };
          expectedResult = service.addCoursToCollectionIfMissing([], null, cours, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(cours);
        });

        it('should return initial array if no Cours is added', () => {
          const coursCollection: ICours[] = [{ id: 123 }];
          expectedResult = service.addCoursToCollectionIfMissing(coursCollection, undefined, null);
          expect(expectedResult).toEqual(coursCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
