import {Component, OnInit, TemplateRef, EventEmitter, Output} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {ServiceStateService, StatePlanning} from "../../service/service-state.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-activite-modal',
  templateUrl: './activite-modal.component.html',
  styleUrls: ['./activite-modal.component.css']
})
export class ActiviteModalComponent implements OnInit {


  @Output()
  isHiddenPlanning: EventEmitter<boolean> = new EventEmitter<boolean>();

  refShow: any;

  constructor(private modalRef: BsModalRef,
              private route: Router,
              private serviceState: ServiceStateService) {
  }

  //constructor() { }

  ngOnInit() {

    console.log('Listtt ', this.modalRef);
  }


  close() {
    console.log('close');
    this.modalRef.hide();
    this.isHiddenPlanning.emit(false);

    if (this.modalRef.content) {
      console.log('this.modalRef.content.init ', this.modalRef.content.init);
      this.serviceState.sendPlanningState(new StatePlanning(this.modalRef.content.init, null));
    }

    this.route.navigateByUrl('/planning');

  }


}
