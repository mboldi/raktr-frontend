import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-rents',
  templateUrl: './rents.component.html',
  styleUrls: ['./rents.component.css'],
  providers : [Title]
})
export class RentsComponent implements OnInit {

  constructor(private title: Title) {
    this.title.setTitle('Raktr - Bérlések');
  }

  ngOnInit(): void {
  }

}
