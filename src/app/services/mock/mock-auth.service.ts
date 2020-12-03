import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../user.service';
// @ts-ignore
import moment = require('moment');

@Injectable({
    providedIn: 'root'
})
export class MockAuthService {

    constructor() {
    }

    login(username: string, password: string) {
        this.setSession(JSON.parse('{"body": {"expiresAt": "1111.11.11.", "token": "token"}}'), username);
        return true;
    }

    setSession(authResult, username) {
        localStorage.setItem('id_token', authResult.body.token);
        localStorage.setItem('expires_at', authResult.body.expiresAt);
        localStorage.setItem('username', username);
    }

    logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('username');
        localStorage.removeItem('expires_at');
    }

    public isLoggedIn() {
        return true;
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
