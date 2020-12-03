import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DevicesComponent} from './devices.component';
import {UserService} from '../services/user.service';
import {MockUserService} from '../services/mock/mock-user.service';
import {By, Title} from '@angular/platform-browser';
import {CompositeService} from '../services/composite.service';
import {MockCompositeService} from '../services/mock/mock-composite.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeviceService} from '../services/device.service';
import {MockDeviceService} from '../services/mock/mock-device.service';
import {of} from 'rxjs';

describe('TableListComponent', () => {
    let component: DevicesComponent;
    let fixture: ComponentFixture<DevicesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DevicesComponent],
            providers: [
                Title,
                NgbModal,
                {provide: UserService, useClass: MockUserService},
                {provide: DeviceService, useClass: MockDeviceService},
                {provide: CompositeService, useClass: MockCompositeService},
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DevicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Title should be "Raktr - Eszközök"', () => {
        fixture.detectChanges();
        expect(component.title.getTitle()).toEqual('Raktr - Eszközök');
    });

    it('should get Device list from service', (done) => {
        const spy = spyOn(component.deviceService, 'getDevices').and.returnValue(of(MockDeviceService.mockDevices))
        component.ngOnInit();
        spy.calls.mostRecent().returnValue.subscribe(() => {
            fixture.detectChanges()
            expect(component.devices).toEqual(MockDeviceService.mockDevices);
            done();
        });
    });

    it('should get Composite Item list from service', (done) => {
        const spy = spyOn(component.compositeService, 'getCompositeItems').and.returnValue(of(MockCompositeService.mockCompositeItems))
        component.ngOnInit();
        spy.calls.mostRecent().returnValue.subscribe(() => {
            fixture.detectChanges()
            expect(component.compositeItems).toEqual(MockCompositeService.mockCompositeItems);
            done();
        });
    });

    it('first list row should be device 0', (done) => {
        const spy = spyOn(component.deviceService, 'getDevices').and.returnValue(of(MockDeviceService.mockDevices))
        component.ngOnInit();
        spy.calls.mostRecent().returnValue.subscribe(() => {
            fixture.detectChanges()
            const row = fixture.debugElement.query(By.css('tr'));

            expect(row.children[0].nativeElement.textContent.trim()).toEqual('320 kamera');
            expect(row.children[1].nativeElement.textContent.trim()).toEqual('Sony');
            expect(row.children[2].nativeElement.textContent.trim()).toEqual('PMW-320');
            expect(row.children[3].nativeElement.textContent.trim()).toEqual('1');
            expect(row.children[4].nativeElement.textContent.trim()).toEqual('Videó');
            expect(row.children[5].nativeElement.textContent.trim()).toEqual('Stúdiótér');
            expect(row.children[6].nativeElement.textContent.trim()).toEqual('8 kg');
            expect(row.children[7].nativeElement.textContent.trim()).toEqual('B-CAM-320-1');
            done();
        });
    });
});
