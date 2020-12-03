import {Injectable} from '@angular/core';
import {Location} from '../../model/Location';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MockLocationService {
    public static mockLocations = [
        new Location(
            0,
            'Stúdiótér'
        ),
        new Location(
            1,
            '110'
        )
    ];

    constructor() {
    }

    getLocations(): Observable<Location[]> {
        return of(MockLocationService.mockLocations);
    }
}
