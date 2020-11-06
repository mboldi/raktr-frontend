import {Component, Input, OnInit} from '@angular/core';
import {CompositeItem} from '../model/CompositeItem';
import {FormControl} from '@angular/forms';
import {Location} from '../model/Location';
import {Observable} from 'rxjs';
import {CompositeService} from '../services/composite.service';
import {LocationService} from '../services/location.service';
import {map, startWith} from 'rxjs/operators';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Device} from '../model/Device';
import * as $ from 'jquery';
import {DeviceService} from '../services/device.service';

@Component({
    selector: 'app-edit-composite-modal',
    templateUrl: './edit-composite-modal.component.html',
    styleUrls: ['./edit-composite-modal.component.css']
})
export class EditCompositeModalComponent implements OnInit {
    @Input() title: string;
    @Input() compositeItem: CompositeItem

    locationControl = new FormControl();
    locationOptions: Location[];
    filteredLocationOptions: Observable<Location[]>;
    addDeviceFormControl = new FormControl();

    constructor(public activeModal: NgbActiveModal,
                private compositeItemService: CompositeService,
                private locationService: LocationService,
                private deviceService: DeviceService) {
        if (this.compositeItem === undefined) {
            this.compositeItem = new CompositeItem();
        }
    }

    ngOnInit(): void {

        this.locationService.getLocations().subscribe(locations => {
            this.locationOptions = locations;

            this.filteredLocationOptions = this.locationControl.valueChanges
                .pipe(
                    startWith(''),
                    map(value => value ? this._filterLocations(this.locationOptions, value) : this.locationOptions.slice())
                );
        });

        if (this.compositeItem.location !== null) {
            this.locationControl.setValue(this.compositeItem.location.name);
        }
    }

    private _filterLocations(locations: Location[], value: string): Location[] {
        const filterValue = value.toLowerCase();

        return locations.filter(location => location.name.toLowerCase().includes(filterValue));
    }

    save() {
        this.activeModal.dismiss('save');
    }

    removeFromComposite(device: Device) {
        const indexOfDevice = this.compositeItem.devices.indexOf(device);

        if (indexOfDevice > -1) {
            this.compositeItem.devices.splice(indexOfDevice, 1);
        } else {
            this.showNotification('Ez az eszköz nem eleme az összetett eszköznek', 'warning')
        }
    }

    addDeviceToComposite() {
        this.deviceService.getDeviceByBarcode(this.addDeviceFormControl.value).subscribe(deviceByBarcode => {
            if (deviceByBarcode === undefined) {
                this.showNotification('Nem találtam ilyen eszközt', 'warning');
            } else if (this.inComposite(deviceByBarcode as Device)) {
                this.showNotification('Ezt az eszközt (' + deviceByBarcode.name + ') már tartalmazza az összetett eszköz!', 'warning');
            } else if (!(deviceByBarcode instanceof Device)) {
                this.showNotification('Csak rendes eszközt lehet hozzáadni!', 'warning');
            } else {
                this.compositeItem.devices.push(deviceByBarcode);
                this.showNotification('Hozzáadtam az eszközt!', 'success');
                this.addDeviceFormControl.setValue('');
            }
        });
    }

    inComposite(device: Device): boolean {
        const indexOf = this.compositeItem.devices.indexOf(device);
        return indexOf !== -1;
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
