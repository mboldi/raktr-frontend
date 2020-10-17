import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MOCK_CATEGORIES} from '../mockData/mockCategories';
import {MOCK_LOCATIONS} from '../mockData/mockLocations';
import {Category} from '../model/Category';
import {Location} from '../model/Location';
import {Device} from '../model/Device';
import {DeviceService} from '../services/device.service';
import {CompositeItem} from '../model/CompositeItem';
import {CompositeService} from '../services/composite.service';

@Component({
    selector: 'app-table-list',
    templateUrl: './devices.component.html',
    styleUrls: ['./devices.component.css'],
    providers: [Title]
})
export class DevicesComponent implements OnInit {

    categoryControl = new FormControl();
    categoryOptions: Category[] = MOCK_CATEGORIES;
    filteredCategoryOptions: Observable<Category[]>;
    locationControl = new FormControl();
    locationOptions: Location[] = MOCK_LOCATIONS;
    filteredLocationOptions: Observable<Location[]>;

    deviceSearchControl = new FormControl();
    compositeItemSearchControl = new FormControl();

    devices: Device[];
    filteredDevices: Observable<Device[]>

    compositeItems: CompositeItem[];
    filteredCompositeItems: Observable<CompositeItem[]>;

    constructor(private title: Title, private deviceService: DeviceService, private compositeService: CompositeService) {
        this.title.setTitle('Raktr - Eszközök');
    }

    getDevices() {
        this.deviceService.getDevices().subscribe(devices => this.devices = devices);
    }

    getCompositeItems() {
        this.compositeService.getCompositeItems().subscribe(items => this.compositeItems = items);
    }

    ngOnInit() {
        this.getDevices();
        this.getCompositeItems();

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

        this.filteredDevices = this.deviceSearchControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterDevices(this.devices, value))
            );

        this.filteredCompositeItems = this.compositeItemSearchControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterCompositeItems(this.compositeItems, value))
            );

        console.log(this.filteredCategoryOptions);
    }

    private _filterCategories(categories: Category[], value: string): Category[] {
        const filterValue = value.toLowerCase();

        return categories.filter(category => category.name.toLowerCase().includes(filterValue));
    }

    private _filterLocations(locations: Location[], value: string): Location[] {
        const filterValue = value.toLowerCase();

        return locations.filter(location => location.name.toLowerCase().includes(filterValue));
    }

    private _filterDevices(devices_: Device[], value: string): Device[] {
        const filterValue = value.toLowerCase();

        return devices_.filter(device => device.name.toLowerCase().includes(filterValue) ||
            device.maker.toLowerCase().includes(filterValue) ||
            device.type.toLowerCase().includes(filterValue) ||
            device.barcode.toLowerCase().includes(filterValue));
    }

    private _filterCompositeItems(compositeItems_: CompositeItem[], value: string): CompositeItem[] {
        const filterValue = value.toLowerCase();

        return compositeItems_.filter(compositeItem => compositeItem.name.toLowerCase().includes(filterValue) ||
            compositeItem.barcode.toLowerCase().includes(filterValue));
    }

    createCopy(device: Device) {
        return;
    }

    edit(device: Device) {
        return;
    }
}