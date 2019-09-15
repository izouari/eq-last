import {Injectable, QueryList} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {PlanningDetailComponent} from "../planning/planning-detail/planning-detail.component";


export class StatePlanning {

  constructor(public planningDetailComponent: PlanningDetailComponent,
              public listPlanning: QueryList<PlanningDetailComponent>) {}
}

@Injectable({
  providedIn: 'root'
})

export class ServiceStateService {

  protected sendActivePlannig: BehaviorSubject<StatePlanning> = new BehaviorSubject<StatePlanning>(null);

  planningState = this.sendActivePlannig.asObservable();

  constructor() { }

  sendPlanningState(data: StatePlanning) {
    this.sendActivePlannig.next(data);
  }
}
