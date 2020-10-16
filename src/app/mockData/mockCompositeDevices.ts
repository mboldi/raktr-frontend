import {CompositeItem} from '../model/CompositeItem';
import {MOCK_LOCATIONS} from './mockLocations';
import {MOCK_DEVICES} from './mockDevices';

export const MOCK_COMPOSITE_ITEMS: CompositeItem[] = [
    {
        id: 0,
        name: 'Wireless rack',
        barcode: 'B-FCASE-WLRACK-1',
        devices: [
            MOCK_DEVICES[0],
            MOCK_DEVICES[2]
        ],
        location: MOCK_LOCATIONS[0],
        type_: 'compositeItem'
    },
    {
        id: 1,
        name: 'Közvetítő szett',
        barcode: 'B-OBRACK-1',
        devices: [
            MOCK_DEVICES[1]
        ],
        location: MOCK_LOCATIONS[2],
        type_: 'compositeItem'
    }
]
