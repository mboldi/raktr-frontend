import {Scannable} from './Scannable';
import {Device} from './Device';
import {Location} from './Location';

export class CompositeItem extends Scannable {
    type_ = 'compositeItem';
    devices: Device[];
    location: Location;
}
