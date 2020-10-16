import {Injectable} from '@angular/core';
import {Device} from '../model/Device';
import {MOCK_LOCATIONS} from '../mockData/mockLocations';
import {DeviceStatus} from '../model/DeviceStatus';
import {MOCK_CATEGORIES} from '../mockData/mockCategories';
import {CompositeItem} from '../model/CompositeItem';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CompositeService {

    devices: Device[] = [
        new Device(
            0,
            'Videómixer 2M/E',
            'B-VMIXER-BMD2ME-1',
            'Blackmagic Design',
            'ATEM 2M/E Production Studio',
            'bbbnnnmb',
            1500000,
            6000,
            MOCK_LOCATIONS[1],
            DeviceStatus.GOOD,
            MOCK_CATEGORIES[1],
            1,
        ),
        new Device(
            1,
            'Asztali mikroport vevő',
            'B-MIC-G3DRX-1',
            'Sennheiser',
            'G3',
            '123456dsa',
            50000,
            1500,
            MOCK_LOCATIONS[1],
            DeviceStatus.GOOD,
            MOCK_CATEGORIES[0],
            1,
        )
    ];

    mockCompositeItems = [
        new CompositeItem(
            0,
            'Wireless rack',
            'B-WLRACK-1',
            [
                this.devices[1]
            ],
            MOCK_LOCATIONS[0]
        ),
        new CompositeItem(
            1,
            'Közvetítőszett',
            'B-OBRACK-1',
            [
                this.devices[0]
            ],
            MOCK_LOCATIONS[0]
        )
    ];

    constructor() {
    }

    getCompositeItems(): Observable<CompositeItem[]> {
        return of(this.mockCompositeItems);
    }

    getCopositeItemsNum(): Observable<number> {
        return of(this.mockCompositeItems.length);
    }
}
