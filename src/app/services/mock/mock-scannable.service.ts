import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Scannable} from '../../model/Scannable';
import {MockDeviceService} from './mock-device.service';

@Injectable({
    providedIn: 'root'
})
export class MockScannableService {

    constructor() {
    }

    getScannableByBarcode(barcode: string): Observable<Scannable> {
        return of(MockDeviceService.mockDevices[0]);
    }

}
