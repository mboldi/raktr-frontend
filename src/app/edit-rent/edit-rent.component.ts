import * as $ from 'jquery';
import {Rent} from '../model/Rent';
import {RentService} from '../services/rent.service';
import {Title} from '@angular/platform-browser';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {RentItem} from '../model/RentItem';
import {FormControl} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeviceService} from '../services/device.service';
import {Device} from '../model/Device';
import {DeviceToRentModalComponent} from '../device-to-rent-modal/device-to-rent-modal.component';
import {Scannable} from '../model/Scannable';
import {BackStatus} from '../model/BackStatus';
import {ScannableService} from '../services/scannable.service';

@Component({
    selector: 'app-edit-rent',
    templateUrl: './edit-rent.component.html',
    styleUrls: ['./edit-rent.component.css']
})
export class EditRentComponent implements OnInit {
    rent$: Observable<Rent>;
    rent: Rent;
    filteredRentItems: Observable<RentItem[]>;

    searchControl = new FormControl();
    addDeviceFormControl = new FormControl();

    constructor(private rentService: RentService,
                private deviceService: DeviceService,
                private scannableService: ScannableService,
                private title: Title,
                private route: ActivatedRoute,
                private modalService: NgbModal) {
        this.title.setTitle('Raktr - Bérlés szerkesztése');
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (id === 'new') {
            this.rent = new Rent();
        } else {
            this.rentService.getRent(id).subscribe(rent =>
                this.rent = rent
            )
        }

        this.filteredRentItems = this.searchControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterRentItems(this.rent.rentItems, value))
            );
    }

    private _filterRentItems(rentItems_: RentItem[], value: string): RentItem[] {
        const filterValue = value.toLowerCase();

        return rentItems_.filter(rentItem => rentItem.scannable.name.toLowerCase().includes(filterValue) ||
            rentItem.scannable.barcode.toLowerCase().includes(filterValue));
    }

    addItemToRent() {
        if (this.addDeviceFormControl.value !== null && this.addDeviceFormControl.value !== '') {
            this.scannableService.getScannableByBarcode(this.addDeviceFormControl.value).subscribe(scannable => {
                    if (scannable === undefined) {
                        this.showNotification('Nem találtam eszközt ilyen vonalkóddal!', 'warning');
                    } else if (scannable['@type'] === 'device') {
                        const device = scannable as Device;

                        if (device.quantity > 1) {
                            const editModal = this.modalService.open(DeviceToRentModalComponent, {size: 'md', windowClass: 'modal-holder'});
                            editModal.componentInstance.device = device;

                            editModal.result.catch(result => {
                                if (result !== null && result as number !== 0) {
                                    this.addScannableToRent(device, result);
                                }
                            })
                        } else {
                            this.addScannableToRent(scannable, 1);
                        }
                    } else if (scannable['@type'] === 'compositeItem') {
                        this.addScannableToRent(scannable, 1);
                    } else {
                        this.showNotification('Nem találok ilyet!', 'error');
                    }
                },
                error => {
                    this.showNotification('Nem találtam eszközt ilyen vonalkóddal!', 'warning');
                });


            this.addDeviceFormControl.setValue('');
        } else {
            this.showNotification('Add meg a vonalkódot!', 'warning');
        }
    }

    addScannableToRent(scannable: Scannable, amount: number) {

        let newRentItem = null;

        this.rent.rentItems.forEach(rentItem => {
            if (rentItem.scannable.barcode === scannable.barcode) {
                if (rentItem.outQuantity !== amount) {
                    rentItem.outQuantity = amount;
                    this.showNotification(scannable.name + ' mennyisége frissítve: ' + amount + 'db', 'success');
                } else {
                    this.showNotification('Ez az eszköz (' + scannable.name + ') már hozzá van adva ilyen mennyiségben', 'warning');
                }
                newRentItem = rentItem;
            }
        });

        if (newRentItem === null) {
            newRentItem = new RentItem(undefined,
                scannable,
                BackStatus.OUT,
                amount);

            this.rent.rentItems.push(newRentItem);
            if (amount > 1) {
                this.showNotification(amount + ' darab ' + scannable.name + ' hozzáadva sikeresen!', 'success');
            } else {
                this.showNotification(scannable.name + ' hozzáadva sikeresen!', 'success');
            }
        }

        this.rentService.addItemToRent(this.rent.id, newRentItem);
        this.searchControl.setValue('');
    }

    removeFromRent(rentItem: RentItem) {
        this.rentService.removeFromRent(this.rent.id, rentItem);

        const indexOfItemInRent = this.rent.rentItems.indexOf(rentItem);

        if (indexOfItemInRent > -1) {
            this.rent.rentItems.splice(indexOfItemInRent, 1);
            this.showNotification('Törölve!', 'success');
            this.searchControl.setValue('');
        }
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
