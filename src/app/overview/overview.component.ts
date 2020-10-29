import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {RentService} from '../services/rent.service';
import {DeviceService} from '../services/device.service';
import {Rent} from '../model/Rent';
import {Device} from '../model/Device';
import {FormControl} from '@angular/forms';
import {EditDeviceModalComponent} from '../edit-device-modal/edit-device-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css'],
    providers: [Title]
})
export class OverviewComponent implements OnInit {

    rents: Rent[] = [];
    devices: Device[] = [];
    deviceSearch: string;
    deviceSearchFormControl = new FormControl();

    constructor(private title: Title,
                private rentService: RentService,
                private deviceService: DeviceService,
                private modalService: NgbModal) {
        this.title.setTitle('Raktr - Áttekintés');
    }

    ngOnInit(): void {
        this.rentService.getRents().subscribe(rents => this.rents = rents);
        this.deviceService.getDevices().subscribe(devices => this.devices = devices);
    }

    getNumOfActiveRents(): number {
        return this.rents.filter(rent => rent.actBackDate !== '').length;
    }

    activeRents(): Rent[] {
        return this.rents.filter(rent => rent.actBackDate !== '');
    }

    searchDevice() {
        const barcode = this.deviceSearchFormControl.value;

        if (barcode === '') {
            this.showNotification('Kérlek adj meg egy vonalkódot!', 'warning');
        } else {
            this.deviceService.getDeviceByBarcode(barcode).subscribe(scannable => {
                if (scannable === undefined) {
                    this.showNotification('Nem találtam eszközt ilyen vonalkóddal!', 'warning');
                } else if (scannable.type_ === 'device') {
                    const editModal = this.modalService.open(EditDeviceModalComponent, {size: 'lg', windowClass: 'modal-holder'});
                    editModal.componentInstance.title = 'Eszköz szerkesztése';
                    editModal.componentInstance.device = scannable as Device;
                }
            });
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
