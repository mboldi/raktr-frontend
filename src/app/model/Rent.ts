import {RentItem} from './RentItem';

export class Rent {
    id: number;
    destination: string;
    renter: string;
    issuer: string;
    outDate: string;
    expBackDate: string;
    actBackDate: string;
    rentItems: RentItem[];
}
