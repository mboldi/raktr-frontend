import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {RentService} from '../services/rent.service';
import {DeviceService} from '../services/device.service';
import {Rent} from '../model/Rent';
import {Device} from '../model/Device';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css'],
    providers: [Title]
})
export class OverviewComponent implements OnInit {

    rents: Rent[] = [];
    devices: Device[] = [];

    constructor(private title: Title, private rentService: RentService, private deviceService: DeviceService) {
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

}
