import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {RentService} from '../services/rent.service';
import {DeviceService} from '../services/device.service';
import {Rent} from '../model/Rent';
import {Device} from '../model/Device';
import {FormControl} from '@angular/forms';
import {EditDeviceModalComponent} from '../edit-device-modal/edit-device-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ScannableService} from '../services/scannable.service';
import {EditCompositeModalComponent} from '../edit-composite-modal/edit-composite-modal.component';
import {CompositeItem} from '../model/CompositeItem';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css'],
    providers: [Title]
})
export class OverviewComponent implements OnInit {

    rents: Rent[] = [];
    devices: Device[] = [];
    deviceSearchFormControl = new FormControl();
    numOfActiveRents = 0;

    constructor(public title: Title,
                public rentService: RentService,
                private deviceService: DeviceService,
                public scannableService: ScannableService,
                private modalService: NgbModal) {
        this.title.setTitle('Raktr - Áttekintés');
    }

    ngOnInit(): void {
        this.rentService.getRents().subscribe(rents => {
                this.rents = [];
                rents.forEach(rent => {
                    this.rents.push(Rent.fromJson(rent));
                })
            }
        );
        this.deviceService.getDevices().subscribe(devices => {
            this.devices = [];
            devices.forEach(device => {
                this.devices.push(Device.fromJson(device));
            })
        });
    }

    activeRents(): Rent[] {
        return this.rents.filter(rent => rent.actBackDate === '');
    }

    searchScannable() {
        const barcode = this.deviceSearchFormControl.value;

        if (barcode === '') {
            this.showNotification('Kérlek adj meg egy vonalkódot!', 'warning');
        } else {
            this.scannableService.getScannableByBarcode(barcode).subscribe(scannable => {
                    if (scannable === undefined) {
                        this.showNotification('Nem találtam eszközt ilyen vonalkóddal!', 'warning');
                    } else if (scannable['@type'] === 'device') {
                        const editModal = this.modalService.open(EditDeviceModalComponent, {size: 'lg', windowClass: 'modal-holder'});
                        editModal.componentInstance.title = 'Eszköz szerkesztése';
                        editModal.componentInstance.device = Device.fromJson(scannable as Device);
                    } else if (scannable['@type'] === 'compositeItem') {
                        const editModal = this.modalService.open(EditCompositeModalComponent, {size: 'lg', windowClass: 'modal-holder'});
                        editModal.componentInstance.title = 'Összetett eszköz szerkesztése';
                        editModal.componentInstance.compositeItem = CompositeItem.fromJSON(scannable as CompositeItem);
                    }
                },
                (error => {
                    this.showNotification('Nem találtam eszközt ilyen vonalkóddal!', 'warning');
                }));
        }

        this.deviceSearchFormControl.setValue('');
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
