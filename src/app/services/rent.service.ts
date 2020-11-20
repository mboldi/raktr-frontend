import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Rent} from '../model/Rent';
import {Device} from '../model/Device';
import {MOCK_LOCATIONS} from '../mockData/mockLocations';
import {DeviceStatus} from '../model/DeviceStatus';
import {MOCK_CATEGORIES} from '../mockData/mockCategories';
import {RentItem} from '../model/RentItem';
import {BackStatus} from '../model/BackStatus';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RentService {

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
            MOCK_LOCATIONS[1],
            DeviceStatus.GOOD,
            MOCK_CATEGORIES[0],
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

    constructor(private http: HttpClient) {
    }

    getRents(): Observable<Rent[]> {
        return this.http.get<Rent[]>(`${environment.apiUrl}/api/rent`);
    }

    addRent(rent: Rent): Observable<Rent> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.post<Rent>(`${environment.apiUrl}/api/rent`, Rent.toJsonString(rent), {headers: headers});
    }

    getRent(id: number | string): Observable<Rent> {
        return this.http.get<Rent>(`${environment.apiUrl}/api/rent/${id}`);
    }

    removeFromRent(rentId: number, rentItem: RentItem) {
        rentItem.outQuantity = 0;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.put<Rent>(`${environment.apiUrl}/api/rent/${rentId}`,
            RentItem.toJson(rentItem),
            {headers: headers})
    }

    addItemToRent(rentId: number, newRentItem: RentItem): Observable<Rent> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        console.log(RentItem.toJson(newRentItem));

        return this.http.put<Rent>(`${environment.apiUrl}/api/rent/${rentId}`,
            RentItem.toJson(newRentItem),
            {headers: headers})
    }

    deleteRent(rent: Rent): Observable<Rent> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.request<Rent>('delete', `${environment.apiUrl}/api/rent`,
            {headers: headers, body: Rent.toJsonString(rent)});
    }
}
