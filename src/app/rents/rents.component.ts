import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import 'bootstrap-notify'
import {Rent} from '../model/Rent';
import {RentService} from '../services/rent.service';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-rents',
    templateUrl: './rents.component.html',
    styleUrls: ['./rents.component.css'],
    providers: [Title]
})
export class RentsComponent implements OnInit {
    rents: Rent[] = [];
    filteredRents: Observable<Rent[]>;

    currRent: Rent;
    rentSearchControl = new FormControl();

    constructor(public title: Title,
                public rentService: RentService) {
        this.title.setTitle('Raktr - Bérlések');
    }

    ngOnInit(): void {
        this.rentSearchControl.setValue('');

        this.rentService.getRents().subscribe(rents => {
            rents.forEach(rent => this.rents.push(Rent.fromJson(rent)));

            this.rents = this.rents.sort(((a, b) => {
                const aDate = new Date(a.actBackDate === '' ? a.actBackDate : a.expBackDate);
                const bDate = new Date(b.actBackDate === '' ? b.actBackDate : b.expBackDate);

                return aDate.getTime() - bDate.getTime();
            }));
            this.rentSearchControl.setValue('');
        });

        this.filteredRents = this.rentSearchControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterRents(this.rents, value))
            );
    }

    private _filterRents(rents_: Rent[], value: string): Rent[] {
        const filterValue = value.toLowerCase();

        return rents_.filter(rent => rent.destination.toLowerCase().includes(filterValue) ||
            rent.issuer.toLowerCase().includes(filterValue) ||
            rent.renter.toLowerCase().includes(filterValue));
    }
}
