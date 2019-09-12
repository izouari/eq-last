import {NgModule} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {PlanningRoutingModule} from "./planning-routing.module";
import { PlanningComponent } from './planning.component';


@NgModule({
  declarations: [

  PlanningComponent],
  imports: [
    CommonModule,
    PlanningRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: []
})
export class PlanningModule { }
