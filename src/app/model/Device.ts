import {Scannable} from './Scannable';
import {Location} from './Location';
import {DeviceStatus} from './DeviceStatus';
import {Category} from './Category';

export class Device extends Scannable {
    type_ = 'device';
    maker: string;
    type: string;
    serial: string;
    value: number;
    weight: number;
    location: Location;
    status: DeviceStatus;
    category: Category;
    quantity: number;
}
