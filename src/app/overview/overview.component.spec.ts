import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OverviewComponent} from './overview.component';
import {By, Title} from '@angular/platform-browser';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeviceService} from '../services/device.service';
import {MockDeviceService} from '../services/mock/mock-device.service';
import {RentService} from '../services/rent.service';
import {ScannableService} from '../services/scannable.service';
import {MockRentService} from '../services/mock/mock-rent.service';
import {MockScannableService} from '../services/mock/mock-scannable.service';
import {of} from 'rxjs';

describe('OverviewComponent', () => {
    let component: OverviewComponent;
    let fixture: ComponentFixture<OverviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OverviewComponent],
            providers: [
                Title,
                NgbModal,
                {provide: DeviceService, useClass: MockDeviceService},
                {provide: RentService, useClass: MockRentService},
                {provide: ScannableService, useClass: MockScannableService}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OverviewComponent);
        component = fixture.componentInstance;
        component.rents = MockRentService.mockRents;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('title should be "Raktr - Áttekintés"', () => {
        expect(component.title.getTitle()).toEqual('Raktr - Áttekintés')
    });

    it('should list active rents', (done) => {
        const spy = spyOn(component.rentService, 'getRents').and.returnValue(of(MockRentService.mockRents))
        component.ngOnInit();
        spy.calls.mostRecent().returnValue.subscribe(() => {
            fixture.detectChanges()
            const row = fixture.debugElement.query(By.css('tr'));

            expect(row.children[0].nativeElement.textContent.trim()).toEqual('Jenő');
            expect(row.children[1].nativeElement.textContent.trim()).toEqual('Béla');
            expect(row.children[2].nativeElement.textContent.trim()).toEqual('Konferencia 2020');
            expect(row.children[3].nativeElement.textContent.trim()).toEqual('2020.06.25.');
            expect(row.children[4].nativeElement.textContent.trim()).toEqual('2020.06.27.');
            expect(row.children[5].nativeElement.textContent.trim()).toEqual('2');
            expect(row.children[6].nativeElement.textContent.trim()).toEqual('12 kg');
            done();
        });
    });

    it('should count active rents as 1', () => {
        expect(component.activeRents().length).toEqual(1);
    });

    it('should call service when searching device', () => {
        const spy = spyOn(component.scannableService, 'getScannableByBarcode')
            .and.returnValue(of(MockDeviceService.mockDevices[0]));

        component.deviceSearchFormControl.setValue('barcode');
        component.searchScannable();
        fixture.detectChanges();

        expect(component.scannableService.getScannableByBarcode).toHaveBeenCalled();
    });
});
