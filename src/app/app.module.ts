import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HeaderComponent} from "./core/header/header.component";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {TooltipModule, ModalModule, BsModalService, AccordionModule} from "ngx-bootstrap";
import {EquipeComponent} from "./core/equipe/equipe.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EquipeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot()
  ],
  providers: [BsModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
