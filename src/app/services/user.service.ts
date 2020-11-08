import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../model/User';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {


    constructor(private http: HttpClient) {
    }

    public getUser(username: string): Observable<User> {
        return this.http.get<User>(`${environment.apiUrl}/api/user/${username}`);
    }

    public updateUser(user: User): Observable<User> {
        return this.http.put<User>(`${environment.apiUrl}/api/user/`, user)
    }

    public getCurrentUser(): Observable<User> {
        return this.getUser(localStorage.getItem('username'))
    }
}
