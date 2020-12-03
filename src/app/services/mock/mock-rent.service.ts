import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Rent} from '../../model/Rent';
import {RentItem} from '../../model/RentItem';
import {BackStatus} from '../../model/BackStatus';
import {map} from 'rxjs/operators';
import {MockDeviceService} from './mock-device.service';

@Injectable({
    providedIn: 'root'
})
export class MockRentService {

    public static mockRents: Rent[] = [
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
                    MockDeviceService.mockDevices[0],
                    BackStatus.OUT,
                    1
                ),
                new RentItem(
                    1,
                    MockDeviceService.mockDevices[1],
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
                    MockDeviceService.mockDevices[1],
                    BackStatus.OUT,
                    1
                )
            ]
        )
    ];

    constructor() {
    }

    getRents(): Observable<Rent[]> {
        return of(MockRentService.mockRents);
    }

    getRent(id: number | string) {
        return this.getRents().pipe(
            map((rents: Rent[]) => rents.find(rent => rent.id === +id))
        );
    }

    addRent(rent: Rent): Observable<Rent> {
        return of(rent);
    }

    updateRent(rent: Rent): Observable<Rent> {
        return of(rent);
    }

    updateInRent(rentId: number, rentItem: RentItem) {
        return of(MockRentService.mockRents[0]);
    }

    addItemToRent(rentId: number, newRentItem: RentItem): Observable<Rent> {
        return of(MockRentService.mockRents[0]);
    }

    deleteRent(rent: Rent): Observable<Rent> {
        return of(MockRentService.mockRents[0]);
    }

    getPdf(rent: Rent, pdfRequest: string) {
        return null;
    }
}
