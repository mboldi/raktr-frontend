import {Scannable} from './Scannable';
import {BackStatus} from './BackStatus';

export class RentItem {
    id: number;
    scannable: Scannable;
    backStatus: BackStatus;
    outQuantity: number;


    constructor(id: number, scannable: Scannable, backStatus: BackStatus, outQuantity: number) {
        this.id = id;
        this.scannable = scannable;
        this.backStatus = backStatus;
        this.outQuantity = outQuantity;
    }
}
