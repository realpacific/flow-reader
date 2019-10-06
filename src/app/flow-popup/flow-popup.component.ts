import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-flow-popup',
  templateUrl: './flow-popup.component.html',
  styleUrls: ['./flow-popup.component.scss'],
})
export class FlowPopupComponent implements OnInit {
  sentence = '';

  constructor() {
    this.sentence = localStorage.getItem('data').split(' ').slice(0, 10).join(' ');
  }

  ngOnInit() {
  }

}
