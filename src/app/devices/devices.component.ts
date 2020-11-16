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
import {Sort} from '@angular/material/sort';

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
    sortedDevices: Device[];

    compositeItems: CompositeItem[];
    filteredCompositeItems: Observable<CompositeItem[]>;

    constructor(private title: Title,
                private deviceService: DeviceService,
                private compositeService: CompositeService,
                private modalService: NgbModal) {
        this.title.setTitle('Raktr - Eszközök');
    }

    getCompositeItems() {
        this.compositeService.getCompositeItems().subscribe(items => this.compositeItems = items);
    }

    ngOnInit() {
        this.getCompositeItems();

        this.searchControl.setValue('');

        this.deviceService.getDevices().subscribe(devices => {
            this.devices = devices;
            this.sortedDevices = devices;

            this.searchControl.valueChanges.subscribe(value => {
                this.sortedDevices = devices.filter(device => device.name.toLowerCase().includes(value.toLowerCase()) ||
                    device.maker.toLowerCase().includes(value.toLowerCase()) ||
                    device.type.toLowerCase().includes(value.toLowerCase()) ||
                    device.barcode.toLowerCase().includes(value.toLowerCase()));
            });
        });

        this.filteredCompositeItems = this.searchControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterCompositeItems(this.compositeItems, value))
            );
    }

    sortData(sort: Sort) {
        if (this.devices.length === 0) {
            return;
        }
        const data = this.devices.slice();
        if (!sort.active || sort.direction === '') {
            this.sortedDevices = data;
            return;
        }

        this.sortedDevices = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'name':
                    return compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
                case 'maker':
                    return compare(a.maker.toLowerCase(), b.maker.toLowerCase(), isAsc);
                case 'type':
                    return compare(a.type.toLowerCase(), b.type.toLowerCase(), isAsc);
                case 'quantity':
                    return compare(a.quantity, b.quantity, isAsc);
                case 'category':
                    return compare(a.category.name.toLowerCase(), b.category.name.toLowerCase(), isAsc);
                case 'location':
                    return compare(a.location.name.toLowerCase(), b.location.name.toLowerCase(), isAsc);
                case 'weight':
                    return compare(a.weight, b.weight, isAsc);
                default:
                    return 0;
            }
        });
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

        editModal.result.catch(reason => {
            if (reason === 'delete') {
                this.deviceService.getDevices().subscribe(devices => {
                    console.log(devices);
                    this.devices = devices;
                    this.sortedDevices = devices;
                });
            }
        })
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
                    console.log('create');
                    if (result !== 0) {
                        const index = this.devices.indexOf(result);
                        if (index === -1) {
                            this.devices.push(result as Device);
                            this.showNotification(result.name + ' hozzáadva sikeresen!', 'success');
                        } else {
                            this.devices[index] = (result as Device);
                        }
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

function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
