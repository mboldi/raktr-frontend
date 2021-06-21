import {RentItem} from './RentItem';
import {RentType} from './RentType';
import {Comment} from './Comment';

export class Rent {
    id: number;
    type: RentType;
    destination: string;
    renter: string;
    issuer: string;
    outDate: string;
    expBackDate: string;
    actBackDate: string;
    isFinalized: boolean;
    rentItems: RentItem[];
    comments: Comment[];

    static toJsonString(rent: Rent): string {
        const rentJson = JSON.parse(JSON.stringify(rent));

        if (rentJson.rentItems !== undefined) {
            rentJson.rentItems.forEach(rentItem => {
                rentItem['scannable']['@type'] = rentItem['scannable']['type_']
                if (rentItem['scannable']['type_'] === 'compositeItem') {
                    rentItem['scannable']['devices'].forEach(device => {
                        device['@type'] = device['type_'];
                    })
                }
            })
        }

        return `{\"Rent\": ${JSON.stringify(rentJson)}}`;
    }

    static fromJson(rent: Rent): Rent {
        const newRent = new Rent();
        newRent.id = rent.id;
        newRent.destination = rent.destination;
        newRent.issuer = rent.issuer;
        newRent.renter = rent.renter;
        newRent.outDate = rent.outDate;
        newRent.expBackDate = rent.expBackDate;
        newRent.actBackDate = rent.actBackDate;
        newRent.isFinalized = rent.isFinalized;
        newRent.rentItems = [];

        switch (rent.type.toString()) {
            case 'SIMPLE':
                newRent.type = RentType.SIMPLE;
                break;
            case 'COMPLEX':
                newRent.type = RentType.COMPLEX;
                break;
        }

        rent.rentItems.forEach(rentItem => newRent.rentItems.push(RentItem.fromJson(rentItem)));

        if (rent.comments) {
            if (!newRent.comments) {
                newRent.comments = [];
            }

            rent.comments.forEach(comment => newRent.comments.push(Comment.fromJson(comment)));
        } else {
            newRent.comments = [];
        }

        return newRent;
    }

    constructor(id: number = -1, rentType: RentType = RentType.SIMPLE, destination: string = '', renter: string = '', issuer: string = '',
                outDate: string = '', expBackDate: string = '', actBackDate: string = '', isFinalized: boolean = false,
                rentItems: RentItem[] = []) {
        this.id = id;
        this.type = rentType;
        this.destination = destination;
        this.renter = renter;
        this.issuer = issuer;
        this.outDate = outDate;
        this.expBackDate = expBackDate;
        this.actBackDate = actBackDate;
        this.isFinalized = isFinalized;
        this.rentItems = rentItems;
    }

    getSumWeight(): number {
        let sumWeight = 0;
        this.rentItems.forEach(rentItem => sumWeight += rentItem.outQuantity * rentItem.scannable.getWeight());

        return sumWeight;
    }
}
