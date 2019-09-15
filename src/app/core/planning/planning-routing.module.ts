import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PlanningComponent} from "./planning.component";
import {PlanningByCollabComponent} from "./planning-by-collab/planning-by-collab.component";
import {PlanningByActiviteComponent} from "./planning-by-activite/planning-by-activite.component";
import {PlanningResolver} from "../service/PlanningResolver";

const routes: Routes = [
  {path: '', redirectTo: 'planning', pathMatch: 'full'},
  {
    path: 'planning',
    component: PlanningComponent,
    resolve: {
      planResolve: PlanningResolver
    },
    runGuardsAndResolvers: 'always',
    children: [
      {path: '', redirectTo: 'byCollab', pathMatch: 'full'},
      {path: 'byCollab', component: PlanningByCollabComponent},
      {path: 'byActivite', component: PlanningByActiviteComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningRoutingModule {
}
