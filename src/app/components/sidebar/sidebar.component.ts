import {Component, OnInit} from '@angular/core';

declare const $: any;

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    {path: '/overview', title: 'Áttekintés', icon: 'dashboard', class: ''},
    //{path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: ''},
    {path: '/devices', title: 'Eszközök kezelése', icon: 'sd_storage', class: ''}, //content_paste
    {path: '/rents', title: 'Bérlések kezelése', icon: 'content_paste', class: ''},
    {path: '/user-profile', title: 'Személyes beállítások', icon: 'person', class: ''},
    //{path: '/typography', title: 'Typography', icon: 'library_books', class: ''},
    //{path: '/icons', title: 'Icons', icon: 'bubble_chart', class: ''},
    //{path: '/maps', title: 'Maps', icon: 'location_on', class: ''},
    //{ path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' }
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    menuItems: any[];

    constructor() {
    }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    isMobileMenu() {
        return $(window).width() <= 991;
    };
}
