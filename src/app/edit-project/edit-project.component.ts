import { Component, OnInit } from '@angular/core';
import {Project} from '../model/Project';
import {RentService} from '../_services/rent.service';
import {DeviceService} from '../_services/device.service';
import {ScannableService} from '../_services/scannable.service';
import {UserService} from '../_services/user.service';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {ProjectService} from '../_services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

  project: Project;


  constructor(private projectService: ProjectService,
              private userService: UserService,
              private title: Title,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private fb: FormBuilder,
              private router: Router) {

    if (this.route.snapshot.paramMap.get('id') === 'new') {
      this.project = new Project();
    }
  }

  ngOnInit(): void {
  }

}
