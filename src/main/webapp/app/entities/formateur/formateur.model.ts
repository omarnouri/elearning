import { IMatiere } from 'app/entities/matiere/matiere.model';

export interface IFormateur {
  id?: number;
  nom?: string;
  prenom?: string;
  matieres?: IMatiere[] | null;
}

export class Formateur implements IFormateur {
  constructor(public id?: number, public nom?: string, public prenom?: string, public matieres?: IMatiere[] | null) {}
}

export function getFormateurIdentifier(formateur: IFormateur): number | undefined {
  return formateur.id;
}
