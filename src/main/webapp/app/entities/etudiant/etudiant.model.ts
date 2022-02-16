import { INiveau } from 'app/entities/niveau/niveau.model';

export interface IEtudiant {
  id?: number;
  nom?: string;
  prenom?: string;
  niveau?: INiveau | null;
}

export class Etudiant implements IEtudiant {
  constructor(public id?: number, public nom?: string, public prenom?: string, public niveau?: INiveau | null) {}
}

export function getEtudiantIdentifier(etudiant: IEtudiant): number | undefined {
  return etudiant.id;
}
