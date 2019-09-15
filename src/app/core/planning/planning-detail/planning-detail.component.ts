import {
  Component, OnInit, Input, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef,
  ElementRef, OnDestroy
} from '@angular/core';
import {Planning} from "../../model/planning";
import {Constants} from "../../shared/Constants";
import {ActiviteModalComponent} from "../activite/activite-modal.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {Subscription} from "rxjs";
import {ServiceStateService, StatePlanning} from "../../service/service-state.service";
import {el} from "@angular/platform-browser/testing/src/browser_util";
import {Router, NavigationEnd} from "@angular/router";

@Component({
  selector: 'app-planning-detail',
  templateUrl: './planning-detail.component.html',
  styleUrls: ['./planning-detail.component.css']
})
export class PlanningDetailComponent implements OnInit, OnDestroy {

  @Input()
  planning: Planning;

  @Input()
  day;

  //bsModalRef: BsModalRef;

  modalRef: BsModalRef;

  isHiddenActivite: boolean = true;

  subscriptions: Subscription[] = [];

  Days = ['MONDAY', 'TUESDAT', 'WEDNESDAY', 'THRUSDAY', 'FRIDAY', 'SUNDAY', 'SATURDAY'];

  private subscription: Subscription;

  /*constructor(private modalService: BsModalService) {
   }
   */
  constructor(private modalService: BsModalService,
              private elementRef: ElementRef,
              private router: Router,
              private serviceState: ServiceStateService,
              private changeDetectorRef: ChangeDetectorRef) {
    // this.changeDetectorRef.detach();
    console.log('construct detail')
  }

  ngOnInit() {

    //console.log('planning.affectationsMap[day] ', this.planning.affectationsMap['MONDAY'])
    //this.planning.affectationsMap['MONDAY'].forEach(activite => console.log('ACTIVITE : ', activite));

    /*
     this.router.events.subscribe((e: any) => {
     console.log('route #### ', e)
     // If it is a NavigationEnd event re-initalise the component
     if (e instanceof NavigationEnd) {

     this.serviceState.sendPlanningState(null);

     }
     });
     */


    this.subscription = this.serviceState.planningState.subscribe((elemPlan: StatePlanning) => {

      if (elemPlan) {
        console.log('Receive Elem ', elemPlan.planningDetailComponent);
        console.log('Receive state ', elemPlan.planningDetailComponent.elementRef === this.elementRef)
      }

      if (elemPlan) {

        if (elemPlan.planningDetailComponent.elementRef === this.elementRef) {
          console.log('elemPlan.planningDetailComponent ', elemPlan.planningDetailComponent)
          let ObjectStateDiv: boolean = elemPlan.planningDetailComponent.isHiddenActivite;
          console.log('before Same Elem ######## ', ObjectStateDiv);
          elemPlan.planningDetailComponent.isHiddenActivite = !elemPlan.planningDetailComponent.isHiddenActivite;
          console.log('Same Elem ######## ', elemPlan.planningDetailComponent.isHiddenActivite);
        } else if (elemPlan.planningDetailComponent.day === this.day
        && elemPlan.planningDetailComponent.planning.idCollaborateur === this.planning.idCollaborateur) {

          this.isHiddenActivite = elemPlan.planningDetailComponent.isHiddenActivite;
          console.log('Same day  Same Elem ######## ', this.isHiddenActivite);
        }
      }

    });


  }


  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      console.log('subscription ', subscription);
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  showDetail() {
    console.log('show==')
    this.isHiddenActivite = !this.isHiddenActivite;
  }

  showActivePlanDay(isActive: boolean) {
    console.log('sh : ', this.isHiddenActivite);
    this.isHiddenActivite = isActive;
  }

  openModal(refToShow: HTMLInputElement) {
    console.log(' when open modal the refDetail sendend is ', this);
    const initial = this;
    const initialState = {
      init: initial,
      title: 'Modal with component'
    };

    this.modalRef = this.modalService.show(ActiviteModalComponent, {initialState});
    // this.changeDetectorRef.detach();
    //this.serviceActivePlanningService.sendPlanningState(refToShow);
  }

  /*
   openModalWithComponent() {
   const initialState = {
   list: [
   'Open a modal with component',
   'Pass your data',
   'Do something else',
   '...'
   ],
   title: 'Modal with component'
   };
   this.bsModalRef = this.modalService.show(ActiviteModalComponent, {initialState});
   this.bsModalRef.content.closeBtnName = 'Close';

   }
   */

  ngOnDestroy(): void {

    this.subscription.unsubscribe();
  }

}
