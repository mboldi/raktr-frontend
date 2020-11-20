import {Scannable} from './Scannable';
import {BackStatus} from './BackStatus';
import {Device} from './Device';
import {CompositeItem} from './CompositeItem';

export class RentItem {
    id: number;
    scannable: Scannable;
    backStatus: BackStatus;
    outQuantity: number;

    static fromJson(rentItemString: RentItem): RentItem {
        return new RentItem(rentItemString.id,
            rentItemString.scannable['@type'] === 'device' ?
                Device.fromJson(rentItemString.scannable as Device) :
                CompositeItem.fromJSON(rentItemString.scannable as CompositeItem),
            rentItemString.backStatus,
            rentItemString.outQuantity)
    }

    static toJson(rentItem: RentItem): string {
        console.log(rentItem);
        const rentItemJson = JSON.parse(JSON.stringify(rentItem));

        rentItemJson['scannable'] = rentItem.scannable;
        rentItemJson['scannable']['@type'] = rentItem.scannable.type_;
        return `{\"RentItem\": ${JSON.stringify(rentItem)}}`;
    }

    constructor(id: number = -1, scannable: Scannable = null, backStatus: BackStatus = BackStatus.OUT, outQuantity: number = 1) {
        this.id = id;
        this.scannable = scannable;
        this.backStatus = backStatus;
        this.outQuantity = outQuantity;
    }
}
