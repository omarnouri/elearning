import { ICours } from 'app/entities/cours/cours.model';
import { IFormateur } from 'app/entities/formateur/formateur.model';
import { INiveau } from 'app/entities/niveau/niveau.model';

export interface IMatiere {
  id?: number;
  nom?: string;
  description?: string | null;
  cours?: ICours[] | null;
  formateur?: IFormateur | null;
  niveau?: INiveau | null;
}

export class Matiere implements IMatiere {
  constructor(
    public id?: number,
    public nom?: string,
    public description?: string | null,
    public cours?: ICours[] | null,
    public formateur?: IFormateur | null,
    public niveau?: INiveau | null
  ) {}
}

export function getMatiereIdentifier(matiere: IMatiere): number | undefined {
  return matiere.id;
}
