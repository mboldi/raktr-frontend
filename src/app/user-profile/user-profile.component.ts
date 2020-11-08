import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserService} from '../services/user.service';
import {User} from '../model/User';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
    providers: [Title]
})
export class UserProfileComponent implements OnInit {
    user: Observable<User>;

    constructor(private title: Title,
                private userService: UserService) {
        this.title.setTitle('Raktr - Adatok szerkesztése');

    }

    ngOnInit() {
        this.user = this.userService.getCurrentUser();
    }

}
