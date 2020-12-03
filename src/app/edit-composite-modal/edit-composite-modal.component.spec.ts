import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditCompositeModalComponent} from './edit-composite-modal.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../services/user.service';
import {MockUserService} from '../services/mock/mock-user.service';
import {CompositeService} from '../services/composite.service';
import {MockCompositeService} from '../services/mock/mock-composite.service';
import {LocationService} from '../services/location.service';
import {MockLocationService} from '../services/mock/mock-location.service';
import {DeviceService} from '../services/device.service';
import {MockDeviceService} from '../services/mock/mock-device.service';
import {ScannableService} from '../services/scannable.service';
import {MockScannableService} from '../services/mock/mock-scannable.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';

describe('EditCompositeModalComponent', () => {
    let component: EditCompositeModalComponent;
    let fixture: ComponentFixture<EditCompositeModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditCompositeModalComponent],
            imports: [MatAutocompleteModule],
            providers: [
                NgbActiveModal,
                FormBuilder,
                {provide: CompositeService, useClass: MockCompositeService},
                {provide: LocationService, useClass: MockLocationService},
                {provide: DeviceService, useClass: MockDeviceService},
                {provide: ScannableService, useClass: MockScannableService},
                {provide: UserService, useClass: MockUserService},
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditCompositeModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('title element should be as given in input parameter', () => {
        component.title = 'Test title';
        fixture.detectChanges();
        const row = fixture.debugElement.query(By.css('h3'));

        expect(row.nativeElement.textContent.trim()).toEqual('Test title');
    });

    it('should make list of devices of given composite item', () => {
        component.compositeItem = MockCompositeService.mockCompositeItems[0];
        component.ngOnInit();
        fixture.detectChanges();
        const row = fixture.debugElement.query(By.css('tr'));

        expect(row.children[0].nativeElement.textContent.trim()).toEqual('320 kamera');
        expect(row.children[1].nativeElement.textContent.trim()).toEqual('Sony PMW-320');
    });

    it('should call delete of service', () => {
        component.compositeItem = MockCompositeService.mockCompositeItems[0];
        const spyOnService = spyOn(component.compositeItemService, 'deleteComposite')
            .and.returnValue(of(MockCompositeService.mockCompositeItems[0]));

        component.delete(MockCompositeService.mockCompositeItems[0]);
        fixture.detectChanges();

        expect(component.compositeItemService.deleteComposite).toHaveBeenCalled();
    });

    it('should call deleteFromComposite of service', () => {
        component.compositeItem = MockCompositeService.mockCompositeItems[0];
        const spyOnService = spyOn(component.compositeItemService, 'removeDeviceFromComposite')
            .and.returnValue(of(MockCompositeService.mockCompositeItems[0]));

        component.removeFromComposite(MockDeviceService.mockDevices[0]);
        fixture.detectChanges();

        expect(component.compositeItemService.removeDeviceFromComposite).toHaveBeenCalled();
    });

    it('should calculate the sum weight of a composite item correctly', () => {
        expect(MockCompositeService.mockCompositeItems[0].getWeight()).toEqual(8000);
    })
});
