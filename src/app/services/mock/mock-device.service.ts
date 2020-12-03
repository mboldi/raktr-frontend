import {Injectable} from '@angular/core';
import {Device} from '../../model/Device';
import {DeviceStatus} from '../../model/DeviceStatus';
import {Observable, of} from 'rxjs';
import {Location} from '../../model/Location';
import {Category} from '../../model/Category';
import {MockLocationService} from './mock-location.service';
import {MockCategoryService} from './mock-category.service';

@Injectable({
    providedIn: 'root'
})
export class MockDeviceService {
    public static mockDevices = [
        new Device(
            0,
            '320 kamera',
            'B-CAM-320-1',
            'Sony',
            'PMW-320',
            '123456',
            4500000,
            8000,
            MockLocationService.mockLocations[0],
            DeviceStatus.GOOD,
            MockCategoryService.mockCategories[0],
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
            MockLocationService.mockLocations[1],
            DeviceStatus.GOOD,
            MockCategoryService.mockCategories[1],
            1,
        )
    ];

    constructor() {
    }

    addDevice(device: Device): Observable<Device> {
        MockDeviceService.mockDevices.push(device);
        return of(device);
    }

    updateDevice(device: Device): Observable<Device> {
        return of(device);
    }

    getDevices(): Observable<Device[]> {
        return of(MockDeviceService.mockDevices);
    }

    deleteDevice(device: Device): Observable<Device> {
        const indexOf = MockDeviceService.mockDevices.indexOf(device);
        MockDeviceService.mockDevices.splice(indexOf);

        return of(device);
    }
}
