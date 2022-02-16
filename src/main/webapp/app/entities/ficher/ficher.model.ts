import { ICours } from 'app/entities/cours/cours.model';

export interface IFicher {
  id?: number;
  nom?: string;
  fileContentType?: string | null;
  file?: string | null;
  cours?: ICours | null;
}

export class Ficher implements IFicher {
  constructor(
    public id?: number,
    public nom?: string,
    public fileContentType?: string | null,
    public file?: string | null,
    public cours?: ICours | null
  ) {}
}

export function getFicherIdentifier(ficher: IFicher): number | undefined {
  return ficher.id;
}
