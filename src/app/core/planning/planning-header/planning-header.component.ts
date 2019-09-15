import {Component, OnInit, Input} from '@angular/core';
import {Planning} from "../../model/planning";

@Component({
  selector: 'app-planning-header',
  templateUrl: './planning-header.component.html',
  styleUrls: ['./planning-header.component.css']
})
export class PlanningHeaderComponent implements OnInit {

  @Input()
  planning: Planning;

  constructor() { }

  ngOnInit() {
  }

}
