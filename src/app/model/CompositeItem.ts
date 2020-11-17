import {Scannable} from './Scannable';
import {Device} from './Device';
import {Location} from './Location';

export class CompositeItem extends Scannable {
    type_ = 'compositeItem';
    devices: Device[];
    location: Location;

    static fromJSON(compositeItem: CompositeItem): CompositeItem {
        return new CompositeItem(compositeItem.id,
            compositeItem.name,
            compositeItem.barcode,
            compositeItem.devices,
            compositeItem.location)
    }

    static toJsonString(compositeItem: CompositeItem): string {
        const compositeJson = JSON.parse(JSON.stringify(compositeItem));
        compositeJson['@type'] = 'compositeItem';
        return `{\"CompositeItem\": ${JSON.stringify(compositeJson)}}`;
    }

    constructor(id: number = -1, name: string = '', barcode: string = '', devices: Device[] = [], location: Location = null) {
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
