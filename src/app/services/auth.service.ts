import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
// @ts-ignore
import moment = require('moment');

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {
    }

    // @ts-ignore
    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/login`, {username, password}, {observe: 'response'})
            .subscribe(resp => {
                this.setSession(resp, username);
            });
    }

    setSession(authResult, username) {
        localStorage.setItem('id_token', authResult.body.token);
        localStorage.setItem('expires_at', authResult.body.expiresAt);
        console.log(authResult.body.expiresAt);
        localStorage.setItem('username', username);
    }

    logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('username');
        localStorage.removeItem('expires_at');
    }

    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }
}
