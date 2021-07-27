export class Owner {
    id: number;
    name: string;
    inSchInventory: boolean;

    static fromJson(owner: Owner) {
        return new Owner(
            owner.id,
            owner.name,
            owner.inSchInventory
        )
    }

    constructor(id: number, name: string, inSchInventory: boolean = false) {
        this.id = id;
        this.name = name;
        this.inSchInventory = inSchInventory;
    }
}
