import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICours, getCoursIdentifier } from '../cours.model';

export type EntityResponseType = HttpResponse<ICours>;
export type EntityArrayResponseType = HttpResponse<ICours[]>;

@Injectable({ providedIn: 'root' })
export class CoursService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cours');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(cours: ICours): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cours);
    return this.http
      .post<ICours>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(cours: ICours): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cours);
    return this.http
      .put<ICours>(`${this.resourceUrl}/${getCoursIdentifier(cours) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(cours: ICours): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cours);
    return this.http
      .patch<ICours>(`${this.resourceUrl}/${getCoursIdentifier(cours) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICours>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICours[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCoursToCollectionIfMissing(coursCollection: ICours[], ...coursToCheck: (ICours | null | undefined)[]): ICours[] {
    const cours: ICours[] = coursToCheck.filter(isPresent);
    if (cours.length > 0) {
      const coursCollectionIdentifiers = coursCollection.map(coursItem => getCoursIdentifier(coursItem)!);
      const coursToAdd = cours.filter(coursItem => {
        const coursIdentifier = getCoursIdentifier(coursItem);
        if (coursIdentifier == null || coursCollectionIdentifiers.includes(coursIdentifier)) {
          return false;
        }
        coursCollectionIdentifiers.push(coursIdentifier);
        return true;
      });
      return [...coursToAdd, ...coursCollection];
    }
    return coursCollection;
  }

  protected convertDateFromClient(cours: ICours): ICours {
    return Object.assign({}, cours, {
      dateAjout: cours.dateAjout?.isValid() ? cours.dateAjout.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateAjout = res.body.dateAjout ? dayjs(res.body.dateAjout) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((cours: ICours) => {
        cours.dateAjout = cours.dateAjout ? dayjs(cours.dateAjout) : undefined;
      });
    }
    return res;
  }
}
