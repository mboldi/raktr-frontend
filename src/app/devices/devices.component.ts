import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
    selector: 'app-table-list',
    templateUrl: './devices.component.html',
    styleUrls: ['./devices.component.css'],
    providers: [Title]
})
export class DevicesComponent implements OnInit {

    categoryControl = new FormControl();
    categoryOptions: string[] = ['Videó', 'Audió', 'Világítás'];
    filteredCategoryOptions: Observable<string[]>;
    locationControl = new FormControl();
    locationOptions: string[] = ['110', 'Stúdió', 'Páncél'];
    filteredLocationOptions: Observable<string[]>;

    constructor(private title: Title) {
        this.title.setTitle('Raktr - Eszközök');
    }

    ngOnInit() {
        this.filteredCategoryOptions = this.categoryControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(this.categoryOptions, value))
            );

        this.filteredLocationOptions = this.locationControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(this.locationOptions, value))
            );
    }

    private _filter(options: string[], value: string): string[] {
        const filterValue = value.toLowerCase();

        return options.filter(option => option.toLowerCase().includes(filterValue));
    }

}
