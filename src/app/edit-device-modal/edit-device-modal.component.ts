import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category} from '../model/Category';
import {Observable} from 'rxjs';
import {Location} from '../model/Location';
import {map, startWith} from 'rxjs/operators';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Device} from '../model/Device';
import {LocationService} from '../services/location.service';
import {CategoryService} from '../services/category.service';
import {DeviceService} from '../services/device.service';
import {UserService} from '../services/user.service';
import {User} from '../model/User';

@Component({
    selector: 'app-edit-device-modal',
    templateUrl: './edit-device-modal.component.html',
    styleUrls: ['./edit-device-modal.component.css']
})
export class EditDeviceModalComponent implements OnInit {
    @Input() title: string;
    @Input() device: Device;

    categoryOptions: Category[];
    filteredCategoryOptions: Observable<Category[]>;
    locationOptions: Location[];
    filteredLocationOptions: Observable<Location[]>;
    deviceForm: FormGroup;
    admin = false;
    deleteConfirmed = false;

    constructor(public activeModal: NgbActiveModal,
                private fb: FormBuilder,
                private locationService: LocationService,
                private categoryService: CategoryService,
                private deviceService: DeviceService,
                private userService: UserService) {
        if (this.device === undefined) {
            this.device = new Device();
        }

        this.deviceForm = fb.group({
            name: ['', Validators.required],
            maker: [''],
            type: [''],
            category: ['', Validators.required],
            location: ['', Validators.required],
            barcode: ['', Validators.required],
            weight: ['0'],
            value: ['0'],
            quantity: ['1']
        });
    }

    ngOnInit(): void {
        this.deviceForm.setValue({
            name: this.device.name,
            maker: this.device.maker,
            type: this.device.type,
            category: this.device.category === null ? '' : this.device.category.name,
            location: this.device.location === null ? '' : this.device.location.name,
            barcode: this.device.barcode,
            weight: this.device.weight,
            value: this.device.value,
            quantity: this.device.quantity
        });

        this.userService.getCurrentUser().subscribe(user => {
            this.admin = User.isStudioMember(user);
        });

        this.categoryService.getCategories().subscribe(categories => {
            this.categoryOptions = categories;

            this.filteredCategoryOptions = this.deviceForm.get('category').valueChanges
                .pipe(
                    startWith(''),
                    map(value => value ? this._filterCategories(this.categoryOptions, value) : this.categoryOptions.slice())
                );
        })

        this.locationService.getLocations().subscribe(locations => {
            this.locationOptions = locations;

            this.filteredLocationOptions = this.deviceForm.get('location').valueChanges
                .pipe(
                    startWith(''),
                    map(value => value ? this._filterLocations(this.locationOptions, value) : this.locationOptions.slice())
                );
        });

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
        const values = this.deviceForm.value;
        this.device.name = values.name.toString();
        this.device.maker = values.maker.toString();
        this.device.type = values.type.toString();
        this.device.category = new Category(-1, values.category.toString());
        this.device.location = new Location(-1, values.location.toString());
        this.device.barcode = values.barcode.toString();
        this.device.weight = values.weight;
        this.device.value = values.value;
        this.device.quantity = values.quantity;

        if (this.device.id === -1) {
            // new
            this.deviceService.addDevice(this.device).subscribe(device => this.activeModal.dismiss(device));
        } else {
            // update
            this.deviceService.updateDevice(this.device as Device).subscribe(device => this.activeModal.dismiss(device));
        }
    }

    delete(device: Device) {
        this.deviceService.deleteDevice(device).subscribe(device_ => {
            this.activeModal.dismiss('delete')
        });
    }
}
