import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFicher, getFicherIdentifier } from '../ficher.model';

export type EntityResponseType = HttpResponse<IFicher>;
export type EntityArrayResponseType = HttpResponse<IFicher[]>;

@Injectable({ providedIn: 'root' })
export class FicherService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fichers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ficher: IFicher): Observable<EntityResponseType> {
    return this.http.post<IFicher>(this.resourceUrl, ficher, { observe: 'response' });
  }

  update(ficher: IFicher): Observable<EntityResponseType> {
    return this.http.put<IFicher>(`${this.resourceUrl}/${getFicherIdentifier(ficher) as number}`, ficher, { observe: 'response' });
  }

  partialUpdate(ficher: IFicher): Observable<EntityResponseType> {
    return this.http.patch<IFicher>(`${this.resourceUrl}/${getFicherIdentifier(ficher) as number}`, ficher, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFicher>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFicher[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFicherToCollectionIfMissing(ficherCollection: IFicher[], ...fichersToCheck: (IFicher | null | undefined)[]): IFicher[] {
    const fichers: IFicher[] = fichersToCheck.filter(isPresent);
    if (fichers.length > 0) {
      const ficherCollectionIdentifiers = ficherCollection.map(ficherItem => getFicherIdentifier(ficherItem)!);
      const fichersToAdd = fichers.filter(ficherItem => {
        const ficherIdentifier = getFicherIdentifier(ficherItem);
        if (ficherIdentifier == null || ficherCollectionIdentifiers.includes(ficherIdentifier)) {
          return false;
        }
        ficherCollectionIdentifiers.push(ficherIdentifier);
        return true;
      });
      return [...fichersToAdd, ...ficherCollection];
    }
    return ficherCollection;
  }
}
