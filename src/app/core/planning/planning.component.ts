import {Component, OnInit} from '@angular/core';

import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-planning',
  templateUrl: 'planning.component.html',
  styleUrls: ['planning.component.css']
})
export class PlanningComponent implements OnInit {

  constructor(private route: ActivatedRoute) {

  }


  ngOnInit() {

  }
}
