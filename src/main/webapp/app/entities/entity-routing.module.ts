import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'matiere',
        data: { pageTitle: 'eLearningApp.matiere.home.title' },
        loadChildren: () => import('./matiere/matiere.module').then(m => m.MatiereModule),
      },
      {
        path: 'niveau',
        data: { pageTitle: 'eLearningApp.niveau.home.title' },
        loadChildren: () => import('./niveau/niveau.module').then(m => m.NiveauModule),
      },
      {
        path: 'cours',
        data: { pageTitle: 'eLearningApp.cours.home.title' },
        loadChildren: () => import('./cours/cours.module').then(m => m.CoursModule),
      },
      {
        path: 'formateur',
        data: { pageTitle: 'eLearningApp.formateur.home.title' },
        loadChildren: () => import('./formateur/formateur.module').then(m => m.FormateurModule),
      },
      {
        path: 'etudiant',
        data: { pageTitle: 'eLearningApp.etudiant.home.title' },
        loadChildren: () => import('./etudiant/etudiant.module').then(m => m.EtudiantModule),
      },
      {
        path: 'ficher',
        data: { pageTitle: 'eLearningApp.ficher.home.title' },
        loadChildren: () => import('./ficher/ficher.module').then(m => m.FicherModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
