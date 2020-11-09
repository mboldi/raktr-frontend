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
import {EditCompositeModalComponent} from '../edit-composite-modal/edit-composite-modal.component';
import * as $ from 'jquery';

@Component({
    selector: 'app-table-list',
    templateUrl: './devices.component.html',
    styleUrls: ['./devices.component.css'],
    providers: [Title]
})
export class DevicesComponent implements OnInit {
    currentTab = 'devices';

    searchControl = new FormControl();

    devices: Device[];
    filteredDevices: Observable<Device[]>

    compositeItems: CompositeItem[];
    filteredCompositeItems: Observable<CompositeItem[]>;

    constructor(private title: Title,
                private deviceService: DeviceService,
                private compositeService: CompositeService,
                private modalService: NgbModal) {
        this.title.setTitle('Raktr - Eszközök');
    }

    getDevices() {
        this.deviceService.getDevices().subscribe(devices => {
            this.devices = devices
            this.devices.push()
            console.log(devices);
        });
    }

    getCompositeItems() {
        this.compositeService.getCompositeItems().subscribe(items => this.compositeItems = items);
    }

    ngOnInit() {
        this.getCompositeItems();

        this.searchControl.setValue('');

        this.deviceService.getDevices().subscribe(devices => {
            this.devices = devices;

            this.filteredDevices = this.searchControl.valueChanges
                .pipe(
                    startWith(''),
                    map(value => this._filterDevices(this.devices, value))
                );
        });

        this.filteredCompositeItems = this.searchControl.valueChanges
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

    copyDevice(device: Device) {
        return;
    }

    editDevice(device: Device) {
        const editModal = this.modalService.open(EditDeviceModalComponent, {size: 'lg', windowClass: 'modal-holder'});
        editModal.componentInstance.title = 'Eszköz szerkesztése';
        editModal.componentInstance.device = device;
    }

    copyCompositeItem(compositeItem: CompositeItem) {
        return;
    }

    editCompositeItem(compositeItem: CompositeItem) {
        const editModal = this.modalService.open(EditCompositeModalComponent, {size: 'lg', windowClass: 'modal-holder'});
        editModal.componentInstance.title = 'Összetett eszköz szerkesztése';
        editModal.componentInstance.compositeItem = compositeItem;
    }

    create() {
        switch (this.currentTab) {
            case 'devices':
                const editDeviceModal = this.modalService.open(EditDeviceModalComponent, {size: 'lg', windowClass: 'modal-holder'});
                editDeviceModal.componentInstance.title = 'Új eszköz';

                editDeviceModal.result.catch(result => {
                    console.log(result);
                    if (result !== 0) {
                        this.devices.push(result as Device);
                        this.searchControl.setValue('');
                        this.showNotification(result.name + ' hozzáadva sikeresen!', 'success');
                    }
                });
                break;
            case 'composites':
                const editCompositeModal = this.modalService.open(EditCompositeModalComponent, {size: 'lg', windowClass: 'modal-holder'});
                editCompositeModal.componentInstance.title = 'Új összetett eszköz';
                break;
        }
    }

    setTab(tabName: string) {
        this.currentTab = tabName;
        this.searchControl.setValue('');
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
