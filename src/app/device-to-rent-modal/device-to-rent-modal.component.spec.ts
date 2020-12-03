import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeviceToRentModalComponent} from './device-to-rent-modal.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MockDeviceService} from '../services/mock/mock-device.service';
import {By} from '@angular/platform-browser';

describe('DeviceToRentModalComponent', () => {
    let component: DeviceToRentModalComponent;
    let fixture: ComponentFixture<DeviceToRentModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DeviceToRentModalComponent],
            providers: [
                NgbActiveModal
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeviceToRentModalComponent);
        component = fixture.componentInstance;
        component.device = MockDeviceService.mockDevices[0];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should say the device name in a field', () => {
        const h3 = fixture.debugElement.query(By.css('h3'));

        expect(h3.nativeElement.textContent.trim()).toEqual('320 kamera');
    });

    it('Should say the amount of given device in a field', () => {
        const storedAmountField = fixture.debugElement.query(By.css('h5'));

        expect(storedAmountField.nativeElement.textContent.trim()).toEqual('Tárolt mennyiség: 1 db');
    });

    it('Should set up the device quantity selector field', () => {
        const input = fixture.debugElement.query(By.css('input'));

        expect(input.nativeElement.min).toEqual('1');
        expect(input.nativeElement.max).toEqual('1');
    });
});
