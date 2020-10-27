import * as $ from 'jquery';
import {Rent} from '../model/Rent';
import {RentService} from '../services/rent.service';
import {Title} from '@angular/platform-browser';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith, switchMap} from 'rxjs/operators';
import {RentItem} from '../model/RentItem';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-edit-rent',
    templateUrl: './edit-rent.component.html',
    styleUrls: ['./edit-rent.component.css']
})
export class EditRentComponent implements OnInit {
    rent$: Observable<Rent>;
    rentItems: RentItem[];
    filteredRentItems: Observable<RentItem[]>;

    searchControl = new FormControl();

    constructor(private rentService: RentService,
                private title: Title,
                private route: ActivatedRoute) {
        this.title.setTitle('Raktr - Bérlés szerkesztése');
    }

    ngOnInit(): void {
        this.rent$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.rentService.getRent(params.get('id')))
        );

        this.rent$.subscribe(rent => {
            this.rentItems = rent.rentItems;
        })

        this.filteredRentItems = this.searchControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterRentItems(this.rentItems, value))
            );
    }

    private _filterRentItems(rentItems_: RentItem[], value: string): RentItem[] {
        const filterValue = value.toLowerCase();

        return rentItems_.filter(rentItem => rentItem.scannable.name.toLowerCase().includes(filterValue) ||
            rentItem.scannable.barcode.toLowerCase().includes(filterValue));
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

    removeFromRent(rentItem: RentItem) {
        return;
    }
}
