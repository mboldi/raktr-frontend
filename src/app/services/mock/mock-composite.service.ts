import {Injectable} from '@angular/core';
import {CompositeItem} from '../../model/CompositeItem';
import {Observable, of} from 'rxjs';
import {MockDeviceService} from './mock-device.service';
import {MockLocationService} from './mock-location.service';
import {HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Device} from '../../model/Device';

@Injectable({
    providedIn: 'root'
})
export class MockCompositeService {

    public static mockCompositeItems = [
        new CompositeItem(
            0,
            'Wireless rack',
            'B-WLRACK-1',
            [
                MockDeviceService.mockDevices[0]
            ],
            MockLocationService.mockLocations[0]
        ),
        new CompositeItem(
            1,
            'Közvetítőszett',
            'B-OBRACK-1',
            [
                MockDeviceService.mockDevices[1]
            ],
            MockLocationService.mockLocations[1]
        )
    ];

    constructor() {
    }

    getCompositeItems(): Observable<CompositeItem[]> {
        return of(MockCompositeService.mockCompositeItems);
    }

    addCompositeItem(compositeItem: CompositeItem): Observable<CompositeItem> {
        MockCompositeService.mockCompositeItems.push(compositeItem);

        return of(compositeItem);
    }

    updateCompositeItem(compositeItem: CompositeItem): Observable<CompositeItem> {
        return of(compositeItem);
    }

    addDeviceToComposite(device: Device, compositeId: number): Observable<CompositeItem> {
        return of(MockCompositeService.mockCompositeItems[0]);
    }

    removeDeviceFromComposite(device: Device, compositeId: number) {
        return of(MockCompositeService.mockCompositeItems[0]);
    }

    getCompositeItemById(id: number): Observable<CompositeItem> {
        return of(MockCompositeService.mockCompositeItems[0]);
    }

    deleteComposite(compositeItem: CompositeItem): Observable<CompositeItem> {
        return of(compositeItem);
    }
}
