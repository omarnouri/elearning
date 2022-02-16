import * as dayjs from 'dayjs';
import { IMatiere } from 'app/entities/matiere/matiere.model';

export interface ICours {
  id?: number;
  titre?: string;
  description?: string | null;
  dateAjout?: dayjs.Dayjs | null;
  matiere?: IMatiere | null;
}

export class Cours implements ICours {
  constructor(
    public id?: number,
    public titre?: string,
    public description?: string | null,
    public dateAjout?: dayjs.Dayjs | null,
    public matiere?: IMatiere | null
  ) {}
}

export function getCoursIdentifier(cours: ICours): number | undefined {
  return cours.id;
}
