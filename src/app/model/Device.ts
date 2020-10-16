import {Scannable} from './Scannable';
import {Location} from './Location';
import {DeviceStatus} from './DeviceStatus';
import {Category} from './Category';

export class Device extends Scannable {
    maker: string;
    type: string;
    serial: string;
    value: number;
    weight: number;
    location: Location;
    status: DeviceStatus;
    category: Category;
    quantity: number;

    constructor(id: number, name: string, barcode: string, maker: string, type: string, serial: string, value: number, weight: number,
                location: Location, status: DeviceStatus, category: Category, quantity: number) {
        super('device', id, name, barcode);
        this.maker = maker;
        this.type = type;
        this.serial = serial;
        this.value = value;
        this.weight = weight;
        this.location = location;
        this.status = status;
        this.category = category;
        this.quantity = quantity;
    }

    getWeight() {
        return this.weight;
    }
}
