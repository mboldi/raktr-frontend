import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RentsComponent} from './rents.component';
import {RentService} from '../services/rent.service';
import {By, Title} from '@angular/platform-browser';
import {MockRentService} from '../services/mock/mock-rent.service';
import {of} from 'rxjs';

describe('RentsComponent', () => {
    let component: RentsComponent;
    let fixture: ComponentFixture<RentsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                Title,
                {provide: RentService, useClass: MockRentService}
            ],
            declarations: [RentsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('expect title to be "Raktr - Bérlések"', () => {
        expect(component.title.getTitle()).toEqual('Raktr - Bérlések');
    })

    it('should list rents', (done) => {
        const spy = spyOn(component.rentService, 'getRents').and.returnValue(of(MockRentService.mockRents))
        component.ngOnInit();
        spy.calls.mostRecent().returnValue.subscribe(() => {
            fixture.detectChanges()
            const row = fixture.debugElement.query(By.css('tr'));

            expect(row.children[0].nativeElement.textContent.trim()).toEqual('Jenő');
            expect(row.children[1].nativeElement.textContent.trim()).toEqual('Béla');
            expect(row.children[2].nativeElement.textContent.trim()).toEqual('Konferencia 2020');
            expect(row.children[3].nativeElement.textContent.trim()).toEqual('2020.06.25.');
            expect(row.children[4].nativeElement.textContent.trim()).toEqual('2020.06.27.');
            expect(row.children[5].nativeElement.textContent.trim()).toEqual('Nem jött még vissza');
            expect(row.children[6].nativeElement.textContent.trim()).toEqual('2');
            expect(row.children[7].nativeElement.textContent.trim()).toEqual('12 kg');
            done();
        });
    });
});
