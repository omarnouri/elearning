import { IEtudiant } from 'app/entities/etudiant/etudiant.model';
import { IMatiere } from 'app/entities/matiere/matiere.model';

export interface INiveau {
  id?: number;
  libelle?: string;
  etudiants?: IEtudiant[] | null;
  matieres?: IMatiere[] | null;
}

export class Niveau implements INiveau {
  constructor(public id?: number, public libelle?: string, public etudiants?: IEtudiant[] | null, public matieres?: IMatiere[] | null) {}
}

export function getNiveauIdentifier(niveau: INiveau): number | undefined {
  return niveau.id;
}
