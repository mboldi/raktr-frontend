export abstract class Scannable {
    type_: string;
    id: number;
    name: string;
    barcode: string;


    constructor(type_: string, id: number, name: string, barcode: string) {
        this.type_ = type_;
        this.id = id;
        this.name = name;
        this.barcode = barcode;
    }

    abstract getWeight(): number;
}
