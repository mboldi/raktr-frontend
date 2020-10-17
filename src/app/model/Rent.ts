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

    constructor(id: number, destination: string, renter: string, issuer: string,
                outDate: string, expBackDate: string, actBackDate: string, rentItems: RentItem[]) {
        this.id = id;
        this.destination = destination;
        this.renter = renter;
        this.issuer = issuer;
        this.outDate = outDate;
        this.expBackDate = expBackDate;
        this.actBackDate = actBackDate;
        this.rentItems = rentItems;
    }

    getSumWeight(): number {
        let sumWeight = 0;
        this.rentItems.forEach(rentItem => sumWeight += rentItem.scannable.getWeight());

        return sumWeight;
    }
}
