import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserService} from '../services/user.service';
import {User} from '../model/User';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GeneralDataService} from '../services/general-data.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
    providers: [Title]
})
export class UserProfileComponent implements OnInit {
    user: User;
    personal_settings: FormGroup;
    group_settings: FormGroup;
    global_settings: FormGroup;

    constructor(private title: Title,
                private fb: FormBuilder,
                private userService: UserService,
                private generalDataService: GeneralDataService) {
        this.title.setTitle('Raktr - Adatok szerkesztése');

        this.personal_settings = fb.group({
            username: [{value: '', disabled: true}],
            fullName: [{value: '', disabled: true}],
            nickName: [''],
            personalId: ['']
        });

        this.group_settings = fb.group({
            groupName: [''],
            groupLeaderName: [''],
        });

        this.global_settings = fb.group({
            firstSignerName: [''],
            firstSignerTitle: [''],
            secondSignerName: [''],
            secondSignerTitle: [''],
        });

        this.userService.getCurrentUser().subscribe(user => {
            this.personal_settings.setValue({
                username: [user.username],
                fullName: [user.familyName + ' ' + user.givenName],
                nickName: [user.nickName],
                personalId: [user.personalId]
            });
            this.user = user;
        });

        this.generalDataService.getAll().subscribe(data => {
            this.group_settings.setValue({
                groupName: [data[data.findIndex(data_ => data_.key === 'groupName')].data],
                groupLeaderName: [data[data.findIndex(data_ => data_.key === 'groupLeader')].data],
            });

            this.global_settings.setValue({
                firstSignerName: [data[data.findIndex(data_ => data_.key === 'firstSignerName')].data],
                firstSignerTitle: [data[data.findIndex(data_ => data_.key === 'firstSignerTitle')].data],
                secondSignerName: [data[data.findIndex(data_ => data_.key === 'secondSignerName')].data],
                secondSignerTitle: [data[data.findIndex(data_ => data_.key === 'secondSignerTitle')].data],
            });
        });
    }

    ngOnInit() {
    }

    updateUser() {
        this.user.nickName = this.personal_settings.value.nickName.toString();
        this.user.personalId = this.personal_settings.value.personalId.toString();

        console.log('username: ' + this.user.nickName + ' id: ' + this.user.personalId);

        this.userService.updateUser(this.user).subscribe(user => {
            console.log(user);
        });
    }
}
