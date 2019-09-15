import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Planning} from "../model/planning";

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  private _url = '/assets/planning.json'

  constructor(private http: HttpClient) { }

  getPlannings(): Observable<Planning> {
    return this.http.get<Planning>(this._url);
  }

}
