import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {GeneralData} from '../../model/GeneralData';

@Injectable({
    providedIn: 'root'
})
export class MockGeneralDataService {

    public static mockGeneralData = [
        new GeneralData('groupName', 'groupNameData'),
        new GeneralData('groupLeader', 'groupLeaderData'),
        new GeneralData('firstSignerName', 'firstSignerNameData'),
        new GeneralData('firstSignerTitle', 'firstSignerTitleData'),
        new GeneralData('secondSignerName', 'secondSignerNameData'),
        new GeneralData('secondSignerTitle', 'secondSignerTitleData'),
    ]

    constructor() {
    }

    getAll(): Observable<GeneralData[]> {
        return of(MockGeneralDataService.mockGeneralData);
    }

    updateData(generalData: GeneralData): Observable<GeneralData> {
        return of(generalData);
    }
}
