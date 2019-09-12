import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PlanningComponent} from "./planning.component";

const routes: Routes = [
  {path: '', redirectTo: '/planning', pathMatch: 'full'},
  {path: 'planning', component: PlanningComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningRoutingModule {
}
