import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import * as $ from 'jquery';
import 'bootstrap-notify'
import {Rent} from '../model/Rent';
import {RentService} from '../services/rent.service';

@Component({
    selector: 'app-rents',
    templateUrl: './rents.component.html',
    styleUrls: ['./rents.component.css'],
    providers: [Title]
})
export class RentsComponent implements OnInit {
    rents: Rent[] = [];

    currRent: Rent;

    constructor(private title: Title, private rentService: RentService) {
        this.title.setTitle('Raktr - Bérlések');
    }

    ngOnInit(): void {
        this.rentService.getRents().subscribe(rents => this.rents = rents);
    }

    addItemToRent() {
        this.showNotification('Hozzáadva sikeresen!', 'success');
    }

    showNotification(message_: string, type: string) {
        $['notify']({
            icon: 'add_alert',
            message: message_
        }, {
            type: type,
            timer: 1000,
            placement: {
                from: 'top',
                align: 'right'
            },
            z_index: 2000
        })
    }

    onSelect(rent: Rent) {
        this.currRent = rent;
    }
}
