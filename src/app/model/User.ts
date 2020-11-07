import {UserRole} from './UserRole';

export class User {
    id: number;
    username: string;
    nickName: string;
    familyName: string;
    givenName: string;
    personalId: string;
    roles: UserRole[];
    token?: string;

    constructor(id: number, username: string, nickName: string, familyName: string, givenName: string, personalId: string, roles: UserRole[], token?: string) {
        this.id = id;
        this.username = username;
        this.nickName = nickName;
        this.familyName = familyName;
        this.givenName = givenName;
        this.personalId = personalId;
        this.roles = roles;
        this.token = token;
    }
}
