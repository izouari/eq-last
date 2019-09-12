import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit {

  listST: string[] = ['ST_1', 'ST_2'];

  serviceTraitement;
  uniteGestion;

  constructor() { }

  ngOnInit() {
  }



  changeSt(value) {
    console.log('St ===> ', value.target.value);
  }
}
