import {Component, OnInit, ViewChildren, QueryList} from '@angular/core';
import {Collaborateur} from "../../model/collaborateur";
import {PlanningDetailComponent} from "../planning-detail/planning-detail.component";
import {PlanningService} from "../planning.service";
import {ServiceStateService, StatePlanning} from "../../service/service-state.service";
import * as moment from "moment";
import {Planning} from "../../model/planning";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-planning-by-collab',
  templateUrl: './planning-by-collab.component.html',
  styleUrls: ['./planning-by-collab.component.css']
})
export class PlanningByCollabComponent implements OnInit {

  plannings;
  collaborateurs: Array<Collaborateur> = new Array<Collaborateur>();
  days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURDSDAY', 'FRIDAY', 'SUNDAY', 'SATURDAY'];

  @ViewChildren('showDetail')
  planningDetail: QueryList<PlanningDetailComponent>;

  currentDay;




  constructor(public planningService: PlanningService,
              private serviceState: ServiceStateService,
              private route: ActivatedRoute) {

  }

  ngOnInit() {

    let now = moment(); // add this 2 of 4
    console.log('hello world', now.format()); // add this 3 of 4
    console.log(now.add(7, 'days').format());

    this.currentDay = now.format('dddd');

    console.log('currentDay ==> ', this.currentDay);



     this.route.parent.data.subscribe(data => {
     console.log('data ' , data.planResolve);

     this.plannings = data.planResolve;
     this.plannings.forEach(planning => {
     let collaborateur: Collaborateur = new Collaborateur(planning.idCollaborateur, planning.name);
     this.collaborateurs.push(collaborateur);
     })


  });



    /*
     this.planningService.getPlannings()
     .subscribe((plannings: Planning) => {
     console.log('plannings >>>> ', plannings);
     this.plannings = plannings;
     this.plannings.forEach(planning => {
     let collaborateur: Collaborateur = new Collaborateur(planning.idCollaborateur, planning.name);
     this.collaborateurs.push(collaborateur);
     })
     });
     */

  }

  /*
   test(planningDet: PlanningDetailComponent) {
   console.log('planningDet.isHiddenActivite ', planningDet);
   //planningDet.isHiddenActivite = !planningDet.isHiddenActivite;
   this.planningDetail.forEach((elem: PlanningDetailComponent) => {
   if (elem === planningDet) {
   elem.showDetail();
   }
   })
   //this.planningDetailChild.isHiddenActivite = false;
   }
   */

  test(planningDet: PlanningDetailComponent) {
    console.log('send state planning ===> ', new StatePlanning(planningDet, this.planningDetail));
    this.serviceState.sendPlanningState(new StatePlanning(planningDet, this.planningDetail));
  }

}
