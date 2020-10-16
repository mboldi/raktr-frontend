import {Device} from '../model/Device';
import {MOCK_LOCATIONS} from './mockLocations';
import {MOCK_CATEGORIES} from './mockCategories';
import {DeviceStatus} from '../model/DeviceStatus';

export const MOCK_DEVICES: Device[] = [
    {
        type_: 'device',
        id: 0,
        name: '320 kamera',
        barcode: 'B-CAMERA-320-1',
        maker: 'Sony',
        type: 'PMW-320',
        category: MOCK_CATEGORIES[1],
        location: MOCK_LOCATIONS[0],
        quantity: 1,
        serial: 'aaaassssdddaa332',
        status: DeviceStatus.GOOD,
        value: 4500000,
        weight: 8000
    },
    {
        type_: 'device',
        id: 1,
        name: 'EX3 kamera',
        barcode: 'B-CAMERA-EX3-1',
        maker: 'Sony',
        type: 'PMW-EX3',
        category: MOCK_CATEGORIES[1],
        location: MOCK_LOCATIONS[0],
        quantity: 1,
        serial: 'aaaa332',
        status: DeviceStatus.GOOD,
        value: 2500000,
        weight: 4000
    },
    {
        type_: 'device',
        id: 2,
        name: '2 csöves tabló',
        barcode: 'B-LIGHT-B2x55-01',
        maker: 'Balogh',
        type: 'fl2x55',
        category: MOCK_CATEGORIES[3],
        location: MOCK_LOCATIONS[1],
        quantity: 1,
        serial: 'asdasddsa',
        status: DeviceStatus.GOOD,
        value: 45000,
        weight: 9000
    }
]
