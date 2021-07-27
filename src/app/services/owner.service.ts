import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Owner} from '../model/Owner';

@Injectable({
    providedIn: 'root'
})
export class OwnerService {

    constructor(private http: HttpClient) {
    }

    getOwners(): Observable<Owner[]> {
        return this.http.get<Owner[]>(`${environment.apiUrl}/api/owner`)
            .pipe(
                map(owners => {
                    const ownerss_typed: Owner[] = [];

                    owners.forEach(owner => ownerss_typed.push(Owner.fromJson(owner)))

                    return ownerss_typed;
                })
            );
    }
}
