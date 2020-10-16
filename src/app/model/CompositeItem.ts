import {Scannable} from './Scannable';
import {Device} from './Device';
import {Location} from './Location';

export class CompositeItem extends Scannable {
    type_ = 'compositeItem';
    devices: Device[];
    location: Location;


    constructor(id: number, name: string, barcode: string, devices: Device[], location: Location) {
        super('compositeItem', id, name, barcode);
        this.devices = devices;
        this.location = location;
    }

    getWeight() {
        let sum = 0;

        this.devices.forEach(device => {
            sum += device.weight;
        });

        return sum;
    }
}
