import {Rent} from '../model/Rent'
import {MOCK_DEVICES} from './mockDevices';
import {BackStatus} from '../model/BackStatus';

export const RENTS: Rent[] = [
    {
        id: 0,
        destination: 'Fontos közvi',
        issuer: 'Boldi',
        renter: 'Jenő',
        outDate: '2020.12.12.',
        expBackDate: '2020.12.14.',
        actBackDate: '',
        rentItems:
            [
                {
                    id: 0,
                    scannable: MOCK_DEVICES[0],
                    backStatus: BackStatus.OUT,
                    outQuantity: 1
                }
            ]
    },
    {
        id: 1,
        destination: 'Simonyi Konferencia 2020',
        issuer: 'István',
        renter: 'Béla',
        outDate: '2020.06.12.',
        expBackDate: '2020.06.14.',
        actBackDate: '2020.07.01.',
        rentItems: []
    }
]
