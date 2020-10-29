import * as $ from 'jquery';
import {Rent} from '../model/Rent';
import {RentService} from '../services/rent.service';
import {Title} from '@angular/platform-browser';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Observable, of} from 'rxjs';
import {map, startWith, switchMap} from 'rxjs/operators';
import {RentItem} from '../model/RentItem';
import {FormControl} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeviceService} from '../services/device.service';
import {DeviceToRentModalComponent} from '../device-to-rent-modal/device-to-rent-modal.component';
import {Device} from '../model/Device';
import {Scannable} from '../model/Scannable';
import {BackStatus} from '../model/BackStatus';

@Component({
    selector: 'app-edit-rent',
    templateUrl: './edit-rent.component.html',
    styleUrls: ['./edit-rent.component.css']
})
export class EditRentComponent implements OnInit {
    rent$: Observable<Rent>;
    rent: Rent;
    rentItems: RentItem[];
    filteredRentItems: Observable<RentItem[]>;

    searchControl = new FormControl();
    addDeviceFormControl = new FormControl();

    constructor(private rentService: RentService,
                private deviceService: DeviceService,
                private title: Title,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
        this.title.setTitle('Raktr - Bérlés szerkesztése');
    }

    ngOnInit(): void {
        this.rent$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.rentService.getRent(params.get('id')))
        );

        this.rent$.subscribe(rent => {
            this.rentItems = rent.rentItems;
            this.rent = rent;
            this.filteredRentItems = of(this.rentItems);
        })

        this.filteredRentItems = this.searchControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterRentItems(this.rentItems, value))
            );
    }

    private _filterRentItems(rentItems_: RentItem[], value: string): RentItem[] {
        const filterValue = value.toLowerCase();

        return rentItems_.filter(rentItem => rentItem.scannable.name.toLowerCase().includes(filterValue) ||
            rentItem.scannable.barcode.toLowerCase().includes(filterValue));
    }

    addItemToRent() {
        if (this.addDeviceFormControl.value !== null && this.addDeviceFormControl.value !== '') {


            this.deviceService.getDeviceByBarcode(this.addDeviceFormControl.value).subscribe(scannable => {
                if (scannable === undefined) {
                    this.showNotification('Nem találok ilyet!', 'warning');
                }

                if (scannable.type_ === 'device') {
                    const device = scannable as Device;

                    if (device.quantity > 1) {
                        const editModal = this.modalService.open(DeviceToRentModalComponent, {size: 'md', windowClass: 'modal-holder'});
                        editModal.componentInstance.device = device;

                        editModal.result.catch(result => {
                            if (result !== null && result as number !== 0) {
                                this.addScannableToRent(device, result);
                                this.showNotification(result + ' darab ' + device.name + ' hozzáadva sikeresen!', 'success');
                            }

                        })
                    } else {
                        this.addScannableToRent(scannable, 1);
                        this.showNotification(scannable.name + ' hozzáadva sikeresen!', 'success');
                    }
                } else if (scannable.type_ === 'composite') {
                    this.addScannableToRent(scannable, 1);
                    this.showNotification(scannable.name + ' hozzáadva sikeresen!', 'success');
                } else {
                    this.showNotification('Nem találok ilyet!', 'error');
                }
            });


            this.addDeviceFormControl.setValue('');
        } else {
            this.showNotification('Add meg a vonalkódot!', 'warning');
        }
    }

    addScannableToRent(scannable: Scannable, amount: number) {
        const newRentItem = new RentItem(0, scannable, BackStatus.OUT, amount);

        this.rent$ = this.rentService.addItemToRent(this.rent.id, newRentItem);

        this.rent$.subscribe(rent => {
            this.rentItems = rent.rentItems;
            this.rent = rent;
            this.filteredRentItems = this.searchControl.valueChanges
                .pipe(
                    startWith(''),
                    map(value => this._filterRentItems(this.rentItems, value))
                );
        })

        console.log(this.rent.rentItems);
    }

    removeFromRent(rentItem: RentItem) {
        this.rentService.removeFromRent(this.rent.id, rentItem);
        this.showNotification('Törölve!', 'success');
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
