import {async, TestBed} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {DeviceService} from './services/device.service';
import {MockDeviceService} from './services/mock-device.service';
import {AuthService} from './services/auth.service';
import {MockAuthService} from './services/mock-auth.service';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            providers: [
                {provide: DeviceService, useClass: MockDeviceService},
                {provide: AuthService, useClass: MockAuthService}
            ]
        }).compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
/*it(`should have as title 'Raktr - Áttekintés'`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        console.log(app);
        expect(app.title).toEqual('Raktr - Áttintés');
    }));

    it('should render title in a h1 tag', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('app works!');
    }));*/
});
