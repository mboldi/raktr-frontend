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
import {CompositeItem} from '../model/CompositeItem';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {PdfGenerationModalComponent} from '../pdf-generation-modal/pdf-generation-modal.component';
import {BarcodePurifier} from '../services/barcode-purifier.service';
import {RentType} from '../model/RentType';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {User} from '../model/User';
import {Comment} from '../model/Comment';

@Component({
    selector: 'app-edit-rent',
    templateUrl: './edit-rent.component.html',
    styleUrls: ['./edit-rent.component.css'],
})
export class EditRentComponent implements OnInit {
    rent: Rent;
    filteredRentItems: Observable<RentItem[]>;
    currentOutDate: Date = new Date();

    searchControl = new FormControl();
    addDeviceFormControl = new FormControl();
    addCommentFormControl = new FormControl();
    rentDataForm: FormGroup;
    newCommentForm: FormGroup;
    fullAccessMember = false;
    admin = false;
    user: User;

    deleteConfirmed = false;
    whyNotFinalizable = 'Hiányzó adatok a lezáráshoz!';

    newComment = '';

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
            rentType: [''],
            destination: ['', Validators.required],
            issuer: ['', Validators.required],
            renter: ['', Validators.required],
            outDate: ['', Validators.required],
            expBackDate: ['', Validators.required],
            actBackDate: ['']
        })

        this.newCommentForm = fb.group(
            {
                commentBody: ['', Validators.required]
            })

        this.userService.getCurrentUser().subscribe(user => {
            this.user = user;

            this.fullAccessMember = User.isStudioMember(user);
            this.admin = User.isAdmin(user);
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (id === 'new') {
            this.rent = new Rent();

            this.setFormFieldsWithRentData();
        } else {
            this.rentService.getRent(id).subscribe(rent => {
                    this.rent = rent;

                    this.setFormFieldsWithRentData();
                    this.sortComments();

                    this.currentOutDate = new Date(this.createDateFromString(this.rent.outDate));
                }
            )
        }

        this.filteredRentItems = this.searchControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterRentItems(this.rent.rentItems, value))
            );
    }

    private setFormFieldsWithRentData() {
        this.rentDataForm.setValue({
            rentType: this.rent.type === RentType.SIMPLE ? 'SIMPLE' : 'COMPLEX',
            destination: this.rent.destination,
            issuer: this.rent.issuer,
            renter: this.rent.renter,
            outDate: this.createDateFromString(this.rent.outDate),
            expBackDate: this.createDateFromString(this.rent.expBackDate),
            actBackDate: this.rent.actBackDate === '' ? '' : this.createDateFromString(this.rent.actBackDate)
        });
    }

    private _filterRentItems(rentItems_: RentItem[], value: string): RentItem[] {
        const filterValue = value.toLowerCase();

        return rentItems_.filter(rentItem => rentItem.scannable.name.toLowerCase().includes(filterValue) ||
            rentItem.scannable.barcode.toLowerCase().includes(filterValue));
    }

    addItemToRent() {
        if (this.addDeviceFormControl.value !== null && this.addDeviceFormControl.value !== '') {
            const barcode = BarcodePurifier.purify(this.addDeviceFormControl.value)

            this.scannableService.getScannableByBarcode(barcode).subscribe(scannable => {
                    if (scannable === undefined) {
                        this.showNotification('Nem találtam eszközt ilyen vonalkóddal!', 'warning');
                    } else if (scannable['type_'] === 'device') {
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
                            this.addScannableToRent(device, 1);
                        }
                    } else if (scannable['type_'] === 'compositeItem') {
                        const composite = scannable as CompositeItem;
                        this.addScannableToRent(composite, 1);
                    } else {
                        this.showNotification('Nem találok ilyet!', 'warning');
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
                this.rent.type === RentType.SIMPLE ? BackStatus.OUT : BackStatus.PLANNED,
                amount);

            this.rentService.addItemToRent(this.rent.id, newRentItem).subscribe(rent_ => {
                this.rentService.getRent(this.rent.id).subscribe(rent => {
                    if (rent === undefined) {
                        this.showNotification('Nem sikerült hozzáadni', 'warning');
                    } else {
                        this.rent = rent;

                        if (amount > 1) {
                            this.showNotification(amount + ' darab ' + scannable.name + ' hozzáadva sikeresen!', 'success');
                        } else {
                            this.showNotification(scannable.name + ' hozzáadva sikeresen!', 'success');
                        }

                        this.searchControl.setValue('');
                    }
                })
            }, error => {
                if (error.status === 409) {
                    this.showNotification('Nem lehetséges ennyit bérelni ebből az eszközből', 'warning');
                } else {
                    this.showNotification('Nem sikerült hozzáadni!', 'warning')
                }
            })
        }

    }

    removeFromRent(rentItem: RentItem) {
        rentItem.outQuantity = 0;
        this.rentService.updateInRent(this.rent.id, rentItem).subscribe(rent_ => {
                this.rentService.getRent(this.rent.id).subscribe(rent => {
                    this.rent = rent;
                    this.searchControl.setValue('');
                    this.showNotification(`${rentItem.scannable.name} törölve!`, 'success');
                })
            },
            error => this.showNotification('Nem sikerült törölni', 'warning'))
    }

    save() {
        const value = this.rentDataForm.value;
        this.rent.destination = value.destination.toString();
        this.rent.issuer = value.issuer.toString();
        this.rent.renter = value.renter.toString();
        this.rent.outDate = this.formatDate(value.outDate.toString());
        this.rent.expBackDate = this.formatDate(value.expBackDate.toString());
        this.rent.actBackDate = this.formatDate(value.actBackDate.toString());

        if (this.rent.id === -1) {
            // new
            this.rentService.addRent(this.rent).subscribe(rent_ => {
                    this.rent = rent_;
                    this.showNotification('Sikeresen mentve', 'success');

                    this.router.navigateByUrl('/rent/' + this.rent.id);
                },
                error => {
                    this.showNotification('Nem sikerült menteni', 'error');
                })
        } else {
            // update
            this.rentService.updateRent(this.rent).subscribe(rent_ => {
                    this.rent = rent_;
                    this.showNotification('Sikeresen mentve', 'success');
                },
                error => {
                    this.showNotification('Nem sikerült menteni', 'error');
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

    createDateFromString(date: string) {
        const splitDate = date.split('.');
        return new Date(+splitDate[0], +splitDate[1] - 1, +splitDate[2], 0, 0, 0, 0);
    }

    delete(rent: Rent) {
        this.rentService.deleteRent(rent).subscribe(rent_ => {
                this.showNotification('Bérlés törölve', 'success');
                this.router.navigateByUrl('/rents')
            }
        )
    }

    packedChanged(checkboxChange: MatCheckboxChange, rentItem: RentItem) {
        if (rentItem.backStatus !== BackStatus.BACK) {
            if (checkboxChange.checked) {
                rentItem.backStatus = BackStatus.OUT;
            } else {
                rentItem.backStatus = BackStatus.PLANNED;
            }

            this.rentService.updateInRent(this.rent.id, rentItem).subscribe(
                rent => {
                    this.rent = rent;
                    this.showNotification('Sikeresen mentve!', 'success');
                },
                error => {
                    this.showNotification('Nem sikerült menteni :(', 'warning')
                    checkboxChange.source.checked = false;
                }
            )
        } else {
            this.showNotification('Már visszajött, nem tudod nem elpakolni :D', 'warning')
            checkboxChange.source.checked = true;
        }
    }

    backChanged(checkboxChange: MatCheckboxChange, rentItem: RentItem) {
        if (rentItem.backStatus === BackStatus.OUT ||
            rentItem.backStatus === BackStatus.BACK) {
            if (checkboxChange.checked) {
                rentItem.backStatus = BackStatus.BACK;
            } else {
                rentItem.backStatus = BackStatus.OUT;
            }

            this.rentService.updateInRent(this.rent.id, rentItem).subscribe(
                rent => {
                    this.rent = rent;
                    this.showNotification('Sikeresen mentve!', 'success');
                },
                error => {
                    this.showNotification('Nem sikerült menteni :(', 'warning')
                    checkboxChange.source.checked = false;
                }
            )
        } else {
            this.showNotification('Még elpakolva sincs, hogy hoztad volna vissza!?', 'warning')
            checkboxChange.source.checked = false;
        }

    }

    quantityChanged(event, rentItem: RentItem) {
        const oldQuantity = rentItem.outQuantity;
        rentItem.outQuantity = event.target.value;

        this.rentService.updateInRent(this.rent.id, rentItem).subscribe(rent => {
                this.showNotification(rentItem.scannable.name + ' mennyisége frissítve: ' + rentItem.outQuantity + 'db', 'success');
            },
            error => {
                this.showNotification('Nem lehet ilyen mennyiségben kivinni!', 'warning');
                event.target.value = oldQuantity;
            }
        )
    }

    isFinalizable() {
        if (this.rent.actBackDate === '') {
            this.whyNotFinalizable = 'Nincs megadva visszaérkezési dátum!';
            return false;
        }

        for (let i = 0; i < this.rent.rentItems.length; i++) {
            if (this.rent.rentItems[i].backStatus !== BackStatus.BACK) {
                this.whyNotFinalizable = 'Nem érkezett minden vissza!';
                return false;
            }
        }

        this.whyNotFinalizable = 'Véglegesíthető';

        return true;
    }

    finalize() {
        //mentés is, szóval igazából update
        this.rent.isFinalized = true;
    }

    unfinalize() {
        this.rent.isFinalized = false;
    }

    getPdf() {
        const pdfModal = this.modalService.open(PdfGenerationModalComponent, {size: 'md', windowClass: 'modal-holder'});
        pdfModal.componentInstance.rent = this.rent;
    }

    setCurrOutDate(event) {
        this.currentOutDate = new Date(event.value);
    }

    setActBackDate($event: MatDatepickerInputEvent<Date>) {
        this.rent.actBackDate = this.formatDate(this.rentDataForm.value.actBackDate.toString());
    }

    typeChanged(event: any) {
        switch (event) {
            case 'SIMPLE':
                this.rent.type = RentType.SIMPLE;
                break;
            case 'COMPLEX':
                this.rent.type = RentType.COMPLEX;
                break;
            default:
                this.rent.type = RentType.SIMPLE;
                break;
        }
    }

    sendComment() {
        const commentBody = this.newCommentForm.value.commentBody;

        if (commentBody !== '') {
            const newComment = new Comment(
                -1,
                commentBody,
                new Date(),
                this.user
            )

            this.rentService.addComment(this.rent, newComment).subscribe(rent => {
                this.newCommentForm.setValue({commentBody: ''});

                this.rent = rent;
                this.sortComments();
            })
        }
    }

    deleteComment(comment: Comment) {
        this.rentService.deleteComment(this.rent, comment).subscribe(rent => {
            this.rent = rent;
        })
    }

    private sortComments() {
        this.rent.comments.sort((a, b) => a.dateOfWriting > b.dateOfWriting ? -1 : 1)
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
