import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFicher, Ficher } from '../ficher.model';

import { FicherService } from './ficher.service';

describe('Service Tests', () => {
  describe('Ficher Service', () => {
    let service: FicherService;
    let httpMock: HttpTestingController;
    let elemDefault: IFicher;
    let expectedResult: IFicher | IFicher[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FicherService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nom: 'AAAAAAA',
        fileContentType: 'image/png',
        file: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Ficher', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Ficher()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Ficher', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            file: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Ficher', () => {
        const patchObject = Object.assign(
          {
            file: 'BBBBBB',
          },
          new Ficher()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Ficher', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            file: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Ficher', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFicherToCollectionIfMissing', () => {
        it('should add a Ficher to an empty array', () => {
          const ficher: IFicher = { id: 123 };
          expectedResult = service.addFicherToCollectionIfMissing([], ficher);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ficher);
        });

        it('should not add a Ficher to an array that contains it', () => {
          const ficher: IFicher = { id: 123 };
          const ficherCollection: IFicher[] = [
            {
              ...ficher,
            },
            { id: 456 },
          ];
          expectedResult = service.addFicherToCollectionIfMissing(ficherCollection, ficher);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Ficher to an array that doesn't contain it", () => {
          const ficher: IFicher = { id: 123 };
          const ficherCollection: IFicher[] = [{ id: 456 }];
          expectedResult = service.addFicherToCollectionIfMissing(ficherCollection, ficher);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ficher);
        });

        it('should add only unique Ficher to an array', () => {
          const ficherArray: IFicher[] = [{ id: 123 }, { id: 456 }, { id: 91585 }];
          const ficherCollection: IFicher[] = [{ id: 123 }];
          expectedResult = service.addFicherToCollectionIfMissing(ficherCollection, ...ficherArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const ficher: IFicher = { id: 123 };
          const ficher2: IFicher = { id: 456 };
          expectedResult = service.addFicherToCollectionIfMissing([], ficher, ficher2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ficher);
          expect(expectedResult).toContain(ficher2);
        });

        it('should accept null and undefined values', () => {
          const ficher: IFicher = { id: 123 };
          expectedResult = service.addFicherToCollectionIfMissing([], null, ficher, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ficher);
        });

        it('should return initial array if no Ficher is added', () => {
          const ficherCollection: IFicher[] = [{ id: 123 }];
          expectedResult = service.addFicherToCollectionIfMissing(ficherCollection, undefined, null);
          expect(expectedResult).toEqual(ficherCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
