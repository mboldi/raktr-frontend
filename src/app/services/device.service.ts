import {Injectable} from '@angular/core';
import {Device} from '../model/Device';
import {MOCK_LOCATIONS} from '../mockData/mockLocations';
import {DeviceStatus} from '../model/DeviceStatus';
import {MOCK_CATEGORIES} from '../mockData/mockCategories';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    mockDevices = [
        new Device(
            0,
            '320 kamera',
            'B-CAMERA-320-1',
            'Sony',
            'PMW-320',
            '123456',
            4500000,
            8000,
            MOCK_LOCATIONS[1],
            DeviceStatus.GOOD,
            MOCK_CATEGORIES[0],
            1,
        ),
        new Device(
            1,
            'EX3 kamera',
            'B-CAMERA-EX3-1',
            'Sony',
            'PMW-EX3',
            '123456dsa',
            2500000,
            4000,
            MOCK_LOCATIONS[1],
            DeviceStatus.GOOD,
            MOCK_CATEGORIES[0],
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
            MOCK_LOCATIONS[0],
            DeviceStatus.GOOD,
            MOCK_CATEGORIES[2],
            1,
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
}