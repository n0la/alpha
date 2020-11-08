export class AlphaItem extends Item
{
    /** @override */
    _initialize() {
        super._initialize();
        this.data.resources = {value: 0};
        this.data.traits = {value: []};
        this.data.value = {value: 0};
        this.data.weight = {value: 0};
        this.data.quantity = {value: 0};
        this.data.description = {value: ""};
    }
}

export class AlphaWeapon extends AlphaItem
{
    /** @override */
    _initialize() {
        super._initialize();
        this.data.skill = {value: "rangedcombat"};
        this.data.ap = {value: 0};
        this.data.damage = {value: 0};
        this.data.ammo = {value: 0, max: 0}
        this.data.magazines = {value: 0, max: 0};
        this.data.range = {value: "close"};
        this.data.salvo = {value: 0};
        this.data.attack_bonus = {value: 0};
        this.data.throwable = {value: false};
    }

    get is_ranged() {
        return (this.data.skill.value == "rangedcombat");
    }

    get is_melee() {
        return (this.data.skill.value == "meleecombat");
    }

    get is_gunnery() {
        return (this.data.skill.value == "gunnery");
    }
}
