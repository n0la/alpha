export class AlphaItem extends Item
{
    /** @override */
    _initialize() {
        super._initialize();
        this.data.resources = 0;
        this.data.traits = [];
        this.data.value = 0;
        this.data.weight = 0;
        this.data.quantity = 0;
        this.data.description = "";
    }
}

export class AlphaWeapon extends AlphaItem
{
    /** @override */
    _initialize() {
        super._initialize();
        this.data.skill = "rangedcombat";

        this.data.ap = 0;

        this.data.damage = 0;

        this.data.ammo = {};
        this.data.ammo.value = 0;
        this.data.ammo.max = 0;

        this.data.magazines = {};
        this.data.magazines.value = 0;
        this.data.magazines.max = 0;

        this.data.range = "close";

        this.data.salvo = 0;
        this.data.attack_bonus = 0;

        this.data.throwable = false;
    }

    get is_ranged() {
        return (this.data.skill == "rangedcombat");
    }

    get is_melee() {
        return (this.data.skill == "meleecombat");
    }

    get is_gunnery() {
        return (this.data.skill == "gunnery");
    }
}
