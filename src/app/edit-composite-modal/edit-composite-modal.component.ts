import {Component, Input, OnInit} from '@angular/core';
import {CompositeItem} from '../model/CompositeItem';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '../model/Location';
import {CompositeService} from '../services/composite.service';
import {LocationService} from '../services/location.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Device} from '../model/Device';
import * as $ from 'jquery';
import {DeviceService} from '../services/device.service';
import {ScannableService} from '../services/scannable.service';
import {UserService} from '../services/user.service';
import {User} from '../model/User';

@Component({
    selector: 'app-edit-composite-modal',
    templateUrl: './edit-composite-modal.component.html',
    styleUrls: ['./edit-composite-modal.component.css']
})
export class EditCompositeModalComponent implements OnInit {
    @Input() title: string;
    @Input() compositeItem: CompositeItem

    compositeDataForm: FormGroup;

    locationControl = new FormControl();
    locationOptions: Location[];
    filteredLocationOptions: Location[];
    addDeviceFormControl = new FormControl();
    admin = false;
    deleteConfirmed = false;

    constructor(public activeModal: NgbActiveModal,
                private fb: FormBuilder,
                private compositeItemService: CompositeService,
                private locationService: LocationService,
                private deviceService: DeviceService,
                private scannableService: ScannableService,
                private userService: UserService) {
        if (this.compositeItem === undefined) {
            this.compositeItem = new CompositeItem();
        }

        this.compositeDataForm = fb.group({
            name: ['', Validators.required],
            location: ['', Validators.required],
            barcode: ['', Validators.required]
        });

        this.userService.getCurrentUser().subscribe(user => {
            this.admin = User.isStudioMember(user);
        });
    }

    ngOnInit(): void {
        this.locationService.getLocations().subscribe(locations => {
            this.locationOptions = locations;
            this.filteredLocationOptions = this.locationOptions;

            this.compositeDataForm.get('location').valueChanges.subscribe(value => {
                    this.filteredLocationOptions = this._filterLocations(this.locationOptions, value);
                }
            )
        });

        this.compositeDataForm.setValue({
            name: this.compositeItem.name,
            location: this.compositeItem.location === null ? '' : this.compositeItem.location.name,
            barcode: this.compositeItem.barcode
        });
    }

    private _filterLocations(locations: Location[], value: string): Location[] {
        const filterValue = value.toLowerCase();

        return locations.filter(location => location.name.toLowerCase().includes(filterValue));
    }

    save() {
        const value = this.compositeDataForm.value;
        this.compositeItem.name = value.name.toString();
        this.compositeItem.barcode = value.barcode.toString();
        this.compositeItem.location = new Location(-1, value.location.toString());

        if (this.compositeItem.id === -1) {
            // new
            this.compositeItemService.addCompositeItem(this.compositeItem).subscribe(compositeItem => {
                this.compositeItem = CompositeItem.fromJSON(compositeItem);
                this.showNotification('Mentve', 'success');
            });
        } else {
            this.compositeItemService.updateCompositeItem(this.compositeItem).subscribe(compositeItem => {
                this.compositeItem = CompositeItem.fromJSON(compositeItem);
                this.compositeDataForm.setValue({
                    name: compositeItem.name,
                    location: compositeItem.location.name,
                    barcode: compositeItem.barcode
                });

                this.showNotification('Mentve', 'success');
            });
        }
    }

    removeFromComposite(device: Device) {

        if (this.inComposite(device)) {
            /*const indexOfDevice = this.compositeItem.devices.indexOf(device);
            this.compositeItem.devices.splice(indexOfDevice, 1);*/
            this.compositeItemService.removeDeviceFromComposite(device, this.compositeItem.id).subscribe(composite => {
                this.compositeItem = CompositeItem.fromJSON(composite);
                this.compositeItem.devices.push();
            })
        } else {
            this.showNotification('Ez az eszköz nem eleme az összetett eszköznek', 'warning');
        }
    }

    addDeviceToComposite() {
        this.scannableService.getScannableByBarcode(this.addDeviceFormControl.value).subscribe(scannable => {
                if (scannable === undefined) {
                    this.showNotification('Nem találtam ilyen eszközt', 'warning');
                } else if (scannable['@type'] === 'compositeItem') {
                    this.showNotification('Összetett eszközt nem lehet hozzáadni!', 'warning');
                } else if (this.inComposite(Device.fromJson(scannable as Device))) {
                    this.showNotification('Ezt az eszközt (' + scannable.name + ') már tartalmazza az összetett eszköz!', 'warning');
                } else {
                    this.compositeItem.devices.push(Device.fromJson(scannable as Device));
                    this.compositeItemService.addDeviceToComposite(Device.fromJson(scannable as Device), this.compositeItem.id)
                        .subscribe(composite => {
                            this.compositeItem = CompositeItem.fromJSON(composite);
                            this.showNotification('Hozzáadtam az eszközt!', 'success');
                        });

                    this.addDeviceFormControl.setValue('');
                }
            },
            error => this.showNotification('Nem tudtam hozzáadni!', 'warning'));
    }

    inComposite(device: Device): boolean {
        let present = false;
        this.compositeItem.devices.forEach(device_ => {
            if (device_.barcode === device.barcode) {
                present = true;
            }
        })
        return present;
    }

    delete(compositeItem: CompositeItem) {
        this.compositeItemService.deleteComposite(compositeItem).subscribe(
            compositeItem_ => this.activeModal.dismiss('delete')
        )
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
}
