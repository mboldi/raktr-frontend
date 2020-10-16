import {Scannable} from './Scannable';
import {BackStatus} from './BackStatus';

export class RentItem {
    id: number;
    scannable: Scannable;
    backStatus: BackStatus;
    outQuantity: number;
}
