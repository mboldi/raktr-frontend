import {Device} from './Device';
import {CompositeItem} from './CompositeItem';

export abstract class Scannable {
    type_: string;
    id: number;
    name: string;
    barcode: string;
/*
    static fromJson(scannable: Scannable): Scannable {
        if (scannable['@type'] === 'device') {
            const deviceJson = scannable as Device;
            return new Device(
                deviceJson.id,
                deviceJson.name,
                deviceJson.barcode,
                deviceJson.maker,
                deviceJson.type,
                deviceJson.serial,
                deviceJson.value,
                deviceJson.weight,
                deviceJson.location,
                deviceJson.status,
                deviceJson.category,
                deviceJson.quantity
            )
        } else {
            const compositeItemJson = scannable as CompositeItem;
            const compositeItem = new CompositeItem(compositeItemJson.id,
                compositeItemJson.name,
                compositeItemJson.barcode,
                [],
                compositeItemJson.location);

            compositeItemJson.devices.forEach(deviceJson => compositeItem.devices.push(new Device(
                deviceJson.id,
                deviceJson.name,
                deviceJson.barcode,
                deviceJson.maker,
                deviceJson.type,
                deviceJson.serial,
                deviceJson.value,
                deviceJson.weight,
                deviceJson.location,
                deviceJson.status,
                deviceJson.category,
                deviceJson.quantity
            )));

            return compositeItem;
        }
    }*/

    constructor(type_: string, id: number, name: string, barcode: string) {
        this.type_ = type_;
        this.id = id;
        this.name = name;
        this.barcode = barcode;
    }

    abstract getWeight(): number;

    abstract toJson(): String;
}

