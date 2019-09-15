import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Planning} from "../model/planning";
import {Observable, of} from "rxjs";
import {PlanningService} from "../planning/planning.service";
import {Injectable} from "@angular/core";
/**
 * Created by izouari on 29/09/2019.
 */

@Injectable()
export class PlanningResolver implements Resolve<Planning> {

  constructor(public planningService: PlanningService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Planning> {
    console.log('Get from resolver')
    return this.planningService.getPlannings();
  }

}
