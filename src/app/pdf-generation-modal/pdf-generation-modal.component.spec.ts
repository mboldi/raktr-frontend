import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PdfGenerationModalComponent} from './pdf-generation-modal.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../services/user.service';
import {MockUserService} from '../services/mock/mock-user.service';
import {RentService} from '../services/rent.service';
import {MockRentService} from '../services/mock/mock-rent.service';
import {By} from '@angular/platform-browser';

describe('PdfGenerationModalComponent', () => {
    let component: PdfGenerationModalComponent;
    let fixture: ComponentFixture<PdfGenerationModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PdfGenerationModalComponent],
            providers: [
                NgbActiveModal,
                FormBuilder,
                {provide: UserService, useClass: MockUserService},
                {provide: RentService, useClass: MockRentService},
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PdfGenerationModalComponent);
        component = fixture.componentInstance;
        component.rent = MockRentService.mockRents[0];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the destination and renter of the rent', () => {
        const h3 = fixture.debugElement.query(By.css('h3'));

        expect(h3.nativeElement.textContent.trim()).toEqual('Konferencia 2020 - Béla');
    })

    it('should call service when generating pdf', () => {
        const spy = spyOn(component.rentService, 'getPdf')
            .and.returnValue(null);

        component.dataFormGroup.setValue({
            renterName: 'István',
            renterId: '123456AA'
        })
        component.generate()
        expect(component.rentService.getPdf).toHaveBeenCalled();
    })
});
