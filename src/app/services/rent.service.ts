import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Rent} from '../model/Rent';
import {Device} from '../model/Device';
import {MOCK_LOCATIONS} from '../mockData/mockLocations';
import {DeviceStatus} from '../model/DeviceStatus';
import {MOCK_CATEGORIES} from '../mockData/mockCategories';
import {RentItem} from '../model/RentItem';
import {BackStatus} from '../model/BackStatus';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RentService {

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

    mockRents: Rent[] = [
        new Rent(
            0,
            'Konferencia 2020',
            'Béla',
            'Jenő',
            '2020.06.25.',
            '2020.06.27.',
            '',
            [
                new RentItem(
                    0,
                    this.mockDevices[0],
                    BackStatus.OUT,
                    1
                ),
                new RentItem(
                    1,
                    this.mockDevices[2],
                    BackStatus.OUT,
                    1
                )
            ]
        ),
        new Rent(
            1,
            'Fontos közvetítés',
            'István',
            'Sándor',
            '2020.12.25.',
            '2020.12.27.',
            '2020.12.28.',
            [
                new RentItem(
                    0,
                    this.mockDevices[1],
                    BackStatus.OUT,
                    1
                )
            ]
        )
    ];

    constructor() {
    }

    getRents(): Observable<Rent[]> {
        return of(this.mockRents);
    }

    getRent(id: number | string) {
        return this.getRents().pipe(
            map((rents: Rent[]) => rents.find(rent => rent.id === +id))
        );
    }

    removeFromRent(rentId: number, rentItem: RentItem) {
        // TODO delete
        return;
    }

    addItemToRent(rentId: number, newRentItem: RentItem): Observable<Rent> {
        console.log("alma");
        this.mockRents.find(rent => rent.id === rentId).rentItems.push(newRentItem);

        console.log(this.mockRents.find(rent => rent.id === rentId));

        return of(this.mockRents.find(rent => rent.id === rentId));
    }
}
