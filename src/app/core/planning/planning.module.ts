import {NgModule} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {PlanningRoutingModule} from "./planning-routing.module";
import { PlanningComponent } from './planning.component';
import { PlanningHeaderComponent } from './planning-header/planning-header.component';
import { PlanningDetailComponent } from './planning-detail/planning-detail.component';
import { ActiviteModalComponent } from './activite/activite-modal.component';
import {ModalModule} from "ngx-bootstrap";
import { PlanningByCollabComponent } from './planning-by-collab/planning-by-collab.component';
import { PlanningByActiviteComponent } from './planning-by-activite/planning-by-activite.component';
import {PlanningResolver} from "../service/PlanningResolver";


@NgModule({
  declarations: [

    PlanningComponent,

    PlanningHeaderComponent,

    PlanningDetailComponent,

    ActiviteModalComponent,

    PlanningByCollabComponent,

    PlanningByActiviteComponent],
  imports: [
    CommonModule,
    PlanningRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot()
  ],
  providers: [PlanningResolver],
  entryComponents: [
    ActiviteModalComponent
  ]
})
export class PlanningModule { }
