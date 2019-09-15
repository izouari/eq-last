import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ActiviteModalComponent} from "./core/planning/activite/activite-modal.component";
import {EquipeComponent} from "./core/equipe/equipe.component";

const routes: Routes = [
  {
    path: 'equipe',
    component: EquipeComponent
  },
  {
    path: '',
    loadChildren: './core/planning/planning.module#PlanningModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
