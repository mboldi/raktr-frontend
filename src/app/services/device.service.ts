import {Injectable} from '@angular/core';
import {Device} from '../model/Device';
import {DeviceStatus} from '../model/DeviceStatus';
import {MOCK_CATEGORIES} from '../mockData/mockCategories';
import {Observable, of} from 'rxjs';
import {Scannable} from '../model/Scannable';
import {Location} from '../model/Location';
import {Category} from '../model/Category';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    mockLocations = [
        new Location(
            0,
            'Stúdiótér'
        ),
        new Location(
            1,
            '110'
        ),
        new Location(
            2,
            'Páncél'
        )
    ];

    mockCategories = [
        new Category(
            0,
            'Videó'
        ),
        new Category(
            1,
            'Audió'
        ),
        new Category(
            2,
            'Világítás'
        ),
        new Category(
            3,
            'Kábel'
        )
    ];

    mockDevices = [
        new Device(
            0,
            '320 kamera',
            'B-CAM-320-1',
            'Sony',
            'PMW-320',
            '123456',
            4500000,
            8000,
            this.mockLocations[2],
            DeviceStatus.GOOD,
            this.mockCategories[0],
            1,
        ),
        new Device(
            1,
            'EX3 kamera',
            'B-CAM-EX3-1',
            'Sony',
            'PMW-EX3',
            '123456dsa',
            2500000,
            4000,
            this.mockLocations[2],
            DeviceStatus.GOOD,
            this.mockCategories[0],
            1,
        ),
        new Device(
            2,
            '2 csöves tabló',
            'B-LIGHT-B2x55w-01',
            'Balogh',
            '2x55W FL',
            'adsad',
            45000,
            9500,
            this.mockLocations[0],
            DeviceStatus.GOOD,
            this.mockCategories[2],
            1,
        ),
        new Device(
            3,
            '15m hosszabbító',
            'B-CABLE-1x16HT-15m',
            'BSS',
            '15m csirke',
            'adsaddd',
            4500,
            1500,
            this.mockLocations[0],
            DeviceStatus.GOOD,
            this.mockCategories[3],
            10,
        )
    ];

    constructor() {
    }

    getDevices(): Observable<Device[]> {
        return of(this.mockDevices);
    }

    getDeviceNum(): Observable<number> {
        return of(this.mockDevices.length);
    }

    getDeviceByBarcode(barcode: string): Observable<Scannable> {
        console.log('"' + barcode + '"');

        const deviceByCode = this.mockDevices.filter(device => device.barcode === barcode)[0];
        console.log(deviceByCode);
        return of(deviceByCode);
    }
}
