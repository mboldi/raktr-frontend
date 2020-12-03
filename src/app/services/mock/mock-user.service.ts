import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {User} from '../../model/User';
import {UserRole} from '../../model/UserRole';

@Injectable({
    providedIn: 'root'
})
export class MockUserService {

    public static mockUser = new User(1,
        'username',
        'nickName',
        'familyName',
        'givenName',
        'personalId',
        [new UserRole(0, 'ROLE_Stúdiós')],
        'token')

    constructor() {
    }

    public getUser(username: string): Observable<User> {
        return of(MockUserService.mockUser);
    }

    public updateUser(user: User): Observable<User> {
        return of(user);
    }

    public getCurrentUser(): Observable<User> {
        return of(MockUserService.mockUser);
    }
}
