import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Category} from '../model/Category';
import {Observable} from 'rxjs';
import {Location} from '../model/Location';
import {MOCK_LOCATIONS} from '../mockData/mockLocations';
import {map, startWith} from 'rxjs/operators';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Device} from '../model/Device';
import {LocationService} from '../services/location.service';
import {CategoryService} from '../services/category.service';

@Component({
    selector: 'app-edit-device-modal',
    templateUrl: './edit-device-modal.component.html',
    styleUrls: ['./edit-device-modal.component.css']
})
export class EditDeviceModalComponent implements OnInit {
    @Input() title: string;
    @Input() device: Device;

    categoryControl = new FormControl();
    categoryOptions: Category[];
    filteredCategoryOptions: Observable<Category[]>;
    locationControl = new FormControl();
    locationOptions: Location[];
    filteredLocationOptions: Observable<Location[]>;

    constructor(public activeModal: NgbActiveModal,
                private locationService: LocationService,
                private categoryService: CategoryService) {
        if (this.device === undefined) {
            this.device = new Device();
        }
    }

    ngOnInit(): void {
        this.categoryService.getCategories().subscribe(categories => {
            this.categoryOptions = categories;

            console.log(this.categoryOptions);

            this.filteredCategoryOptions = this.categoryControl.valueChanges
                .pipe(
                    startWith(''),
                    map(value => value ? this._filterCategories(this.categoryOptions, value) : this.categoryOptions.slice())
                );
        })

        this.locationService.getLocations().subscribe(locations => {
            this.locationOptions = locations;

            this.filteredLocationOptions = this.locationControl.valueChanges
                .pipe(
                    startWith(''),
                    map(value => value ? this._filterLocations(this.locationOptions, value) : this.locationOptions.slice())
                );
        });

        if (this.device.category !== null) {
            this.categoryControl.setValue(this.device.category.name);
        }

        if (this.device.location !== null) {
            this.locationControl.setValue(this.device.location.name);
        }

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
