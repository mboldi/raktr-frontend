import {Routes} from '@angular/router';
import {UserProfileComponent} from '../../user-profile/user-profile.component';
import {DevicesComponent} from '../../devices/devices.component';
import {OverviewComponent} from '../../overview/overview.component';
import {RentsComponent} from '../../rents/rents.component';

export const AdminLayoutRoutes: Routes = [
    {path: 'overview', component: OverviewComponent},
    {path: 'devices', component: DevicesComponent},
    {path: 'rents', component: RentsComponent},
    {path: 'user-profile', component: UserProfileComponent},
];
