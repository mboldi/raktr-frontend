import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Category} from '../model/Category';
import {MOCK_CATEGORIES} from '../mockData/mockCategories';
import {Observable} from 'rxjs';
import {Location} from '../model/Location';
import {MOCK_LOCATIONS} from '../mockData/mockLocations';
import {map, startWith} from 'rxjs/operators';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Device} from '../model/Device';
import * as $ from 'jquery';

@Component({
    selector: 'app-edit-device-modal',
    templateUrl: './edit-device-modal.component.html',
    styleUrls: ['./edit-device-modal.component.css']
})
export class EditDeviceModalComponent implements OnInit {
    @Input() title: string;
    @Input() device: Device;

    categoryControl = new FormControl();
    categoryOptions: Category[] = MOCK_CATEGORIES;
    filteredCategoryOptions: Observable<Category[]>;
    locationControl = new FormControl();
    locationOptions: Location[] = MOCK_LOCATIONS;
    filteredLocationOptions: Observable<Location[]>;

    constructor(public activeModal: NgbActiveModal) {
    }

    ngOnInit(): void {
        if (this.device === undefined) {
            this.device = new Device();
        }

        this.filteredCategoryOptions = this.categoryControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterCategories(this.categoryOptions, value))
            );

        this.filteredLocationOptions = this.locationControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterLocations(this.locationOptions, value))
            );
    }

    private _filterCategories(categories: Category[], value: string): Category[] {
        const filterValue = value.toLowerCase();

        return categories.filter(category => category.name.toLowerCase().includes(filterValue));
    }

    private _filterLocations(locations: Location[], value: string): Location[] {
        const filterValue = value.toLowerCase();

        return locations.filter(location => location.name.toLowerCase().includes(filterValue));
    }

    save() {
        this.activeModal.dismiss('save')
    }
}
