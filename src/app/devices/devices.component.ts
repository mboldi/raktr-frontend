import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Device} from '../model/Device';
import {DeviceService} from '../services/device.service';
import {CompositeItem} from '../model/CompositeItem';
import {CompositeService} from '../services/composite.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditDeviceModalComponent} from '../edit-device-modal/edit-device-modal.component';

@Component({
    selector: 'app-table-list',
    templateUrl: './devices.component.html',
    styleUrls: ['./devices.component.css'],
    providers: [Title]
})
export class DevicesComponent implements OnInit {

    deviceSearchControl = new FormControl();
    compositeItemSearchControl = new FormControl();

    devices: Device[];
    filteredDevices: Observable<Device[]>

    compositeItems: CompositeItem[];
    filteredCompositeItems: Observable<CompositeItem[]>;

    constructor(private title: Title, private deviceService: DeviceService, private compositeService: CompositeService, private modalService: NgbModal) {
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
        const editModal = this.modalService.open(EditDeviceModalComponent, {size: 'lg', windowClass: 'modal-holder'});
        editModal.componentInstance.title = 'Eszköz szerkesztése';
        editModal.componentInstance.device = device;
    }
}
