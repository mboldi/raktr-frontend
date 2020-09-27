import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-table-list',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
  providers : [Title]
})
export class DevicesComponent implements OnInit {

  constructor(private title: Title) {
    this.title.setTitle('Raktr - Eszközök');
  }

  ngOnInit() {
  }

}
