import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserProfileComponent} from './user-profile.component';
import {UserService} from '../services/user.service';
import {MockUserService} from '../services/mock/mock-user.service';
import {GeneralDataService} from '../services/general-data.service';
import {MockGeneralDataService} from '../services/mock/mock-general-data.service';
import {FormBuilder} from '@angular/forms';

describe('UserProfileComponent', () => {
    let component: UserProfileComponent;
    let fixture: ComponentFixture<UserProfileComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserProfileComponent],
            providers: [
                FormBuilder,
                {provide: UserService, useClass: MockUserService},
                {provide: GeneralDataService, useClass: MockGeneralDataService}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', async(() => {
        expect(component).toBeTruthy();
    }));

    it('title should be "Raktr - Adatok szerkesztése"', () => {
        expect(component.title.getTitle()).toEqual('Raktr - Adatok szerkesztése')
    });

    it('should get user from service', () => {
        expect(component.user).toEqual(MockUserService.mockUser);
    });

    it('user should be admin', () => {
        expect(component.admin).toEqual(true);
    });
});
