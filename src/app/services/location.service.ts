import {Injectable} from '@angular/core';
import {Location} from '../model/Location';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
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

    constructor() {
    }

    getLocations(): Observable<Location[]> {
        return of(this.mockLocations);
    }
}
