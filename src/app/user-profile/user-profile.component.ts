import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers : [Title]
})
export class UserProfileComponent implements OnInit {

  constructor(private title: Title) {
    this.title.setTitle('Raktr - Adatok szerkesztése');
  }

  ngOnInit() {
  }

}
