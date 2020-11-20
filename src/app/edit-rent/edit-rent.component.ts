import * as $ from 'jquery';
import {Rent} from '../model/Rent';
import {RentService} from '../services/rent.service';
import {Title} from '@angular/platform-browser';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {RentItem} from '../model/RentItem';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeviceService} from '../services/device.service';
import {Device} from '../model/Device';
import {DeviceToRentModalComponent} from '../device-to-rent-modal/device-to-rent-modal.component';
import {Scannable} from '../model/Scannable';
import {BackStatus} from '../model/BackStatus';
import {ScannableService} from '../services/scannable.service';
import {UserService} from '../services/user.service';
import {User} from '../model/User';
import {CompositeItem} from '../model/CompositeItem';

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
    rentDataForm: FormGroup;
    admin = false;

    constructor(private rentService: RentService,
                private deviceService: DeviceService,
                private scannableService: ScannableService,
                private userService: UserService,
                private title: Title,
                private route: ActivatedRoute,
                private modalService: NgbModal,
                private fb: FormBuilder,
                private router: Router) {
        this.title.setTitle('Raktr - Bérlés szerkesztése');

        this.rentDataForm = fb.group({
            destination: ['', Validators.required],
            issuer: ['', Validators.required],
            renter: ['', Validators.required],
            outDate: ['', Validators.required],
            expBackDate: ['', Validators.required],
            actBackDate: ['']
        })

        this.userService.getCurrentUser().subscribe(user => {
            this.admin = User.isStudioMember(user);
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (id === 'new') {
            this.rent = new Rent();
        } else {
            this.rentService.getRent(id).subscribe(rent => {
                    this.rent = Rent.fromJson(rent);

                    this.rentDataForm.setValue({
                        destination: this.rent.destination,
                        issuer: this.rent.issuer,
                        renter: this.rent.renter,
                        outDate: this.rent.outDate,
                        expBackDate: this.rent.expBackDate,
                        actBackDate: this.rent.actBackDate
                    })
                }
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
                        const device = Device.fromJson(scannable as Device);

                        if (device.quantity > 1) {
                            const editModal = this.modalService.open(DeviceToRentModalComponent, {size: 'md', windowClass: 'modal-holder'});
                            editModal.componentInstance.device = device;

                            editModal.result.catch(result => {
                                if (result !== null && result as number !== 0) {
                                    this.addScannableToRent(device, result);
                                }
                            })
                        } else {
                            this.addScannableToRent(device, 1);
                        }
                    } else if (scannable['@type'] === 'compositeItem') {
                        const composite = CompositeItem.fromJSON(scannable as CompositeItem);
                        this.addScannableToRent(composite, 1);
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

            this.rentService.addItemToRent(this.rent.id, newRentItem).subscribe(rent => {
                if (rent === undefined) {
                    this.showNotification('Nem sikerült hozzáadni', 'warning');
                } else {
                    this.rent = Rent.fromJson(rent);

                    if (amount > 1) {
                        this.showNotification(amount + ' darab ' + scannable.name + ' hozzáadva sikeresen!', 'success');
                    } else {
                        this.showNotification(scannable.name + ' hozzáadva sikeresen!', 'success');
                    }

                    this.searchControl.setValue('');
                }
            })
        }

    }

    removeFromRent(rentItem: RentItem) {
        this.rentService.removeFromRent(this.rent.id, rentItem).subscribe(rent => {
            if (rent === undefined) {
                this.showNotification('Nem sikerült törölni', 'error')
            } else {
                this.rent = Rent.fromJson(rent);
                this.searchControl.setValue('');
                this.showNotification('Törölve!', 'success');
            }
        })
    }

    save() {
        if (this.rent.id === -1) {
            // new
            const value = this.rentDataForm.value;
            this.rent.destination = value.destination.toString();
            this.rent.issuer = value.issuer.toString();
            this.rent.renter = value.renter.toString();
            this.rent.outDate = this.formatDate(value.outDate.toString());
            this.rent.expBackDate = this.formatDate(value.expBackDate.toString());
            this.rent.actBackDate = this.formatDate(value.actBackDate.toString());
            this.rentService.addRent(this.rent).subscribe(rent_ => {
                this.rent = Rent.fromJson(rent_);
                console.log(this.rent);
            })
        }
    }

    formatDate(dateString: string): string {
        if (dateString.length === 0) {
            return '';
        }
        const date = new Date(Date.parse(dateString));
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.`;
    }

    delete(rent: Rent) {
        this.rentService.deleteRent(rent).subscribe(rent_ => {
                this.showNotification('Bérlés törölve', 'success');
                this.router.navigateByUrl('/rents')
            }
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
