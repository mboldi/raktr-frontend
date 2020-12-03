import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditRentComponent} from './edit-rent.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, ParamMap, Params, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../services/user.service';
import {MockUserService} from '../services/mock/mock-user.service';
import {ScannableService} from '../services/scannable.service';
import {RentService} from '../services/rent.service';
import {MockScannableService} from '../services/mock/mock-scannable.service';
import {MockRentService} from '../services/mock/mock-rent.service';
import {RouterTestingModule} from '@angular/router/testing';
import {ReplaySubject} from 'rxjs';

// @ts-ignore
const fakeActivatedRoute = {
    snapshot: {
        paramMap: {
            get(name: string): string | null {
                return '1';
            }
        }
    }
} as ActivatedRoute;

class ActivatedRouteStub implements Partial<ActivatedRoute> {
    private _paramMap: ParamMap;
    private subject = new ReplaySubject<ParamMap>();

    paramMap = this.subject.asObservable();
    get snapshot(): ActivatedRouteSnapshot {
        const snapshot: Partial<ActivatedRouteSnapshot> = {
            paramMap: this._paramMap,
        };

        return snapshot as ActivatedRouteSnapshot;
    }

    constructor(initialParams?: Params) {
        this.setParamMap(initialParams);
    }

    setParamMap(params?: Params) {
        const paramMap = convertToParamMap(params);
        this._paramMap = paramMap;
        this.subject.next(paramMap);
    }
}

describe('EditRentComponent', () => {
    let component: EditRentComponent;
    let fixture: ComponentFixture<EditRentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                NgbModal,
                Title,
                FormBuilder,
                {provide: ActivatedRoute, useClass: fakeActivatedRoute},
                {provide: UserService, useClass: MockUserService},
                {provide: ScannableService, useClass: MockScannableService},
                {provide: RentService, useClass: MockRentService},
            ],
            declarations: [EditRentComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditRentComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    /*it('should create', () => {
        expect(component).toBeTruthy();
    });*/
});
