import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditDeviceModalComponent} from './edit-device-modal.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../services/user.service';
import {MockUserService} from '../services/mock/mock-user.service';
import {DeviceService} from '../services/device.service';
import {MockDeviceService} from '../services/mock/mock-device.service';
import {LocationService} from '../services/location.service';
import {CategoryService} from '../services/category.service';
import {MockLocationService} from '../services/mock/mock-location.service';
import {MockCategoryService} from '../services/mock/mock-category.service';
import {By} from '@angular/platform-browser';

describe('EditDeviceModalComponent', () => {
    let component: EditDeviceModalComponent;
    let fixture: ComponentFixture<EditDeviceModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatAutocompleteModule
            ],
            providers: [
                NgbActiveModal,
                FormBuilder,
                {provide: UserService, useClass: MockUserService},
                {provide: DeviceService, useClass: MockDeviceService},
                {provide: LocationService, useClass: MockLocationService},
                {provide: CategoryService, useClass: MockCategoryService},
            ],
            declarations: [EditDeviceModalComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditDeviceModalComponent);
        component = fixture.componentInstance;
        component.device = MockDeviceService.mockDevices[0];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('title line should be given title', () => {
        component.title = 'title';
        fixture.detectChanges();

        const h3 = fixture.debugElement.query(By.css('h3'));

        expect(h3.nativeElement.textContent.trim()).toEqual('title');
    })

    it('user should be admin', () => {
        component.ngOnInit();
        expect(component.admin).toEqual(true);
    });


});
