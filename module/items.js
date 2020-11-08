export class AlphaItem extends Item
{
    /** @override */
    _initialize() {
        super._initialize();
        this.data.resources = {value: 0};
        this.data.value = {value: 0};
        this.data.weight = {value: 0};
        this.data.quantity = {value: 0};
        this.data.description = {value: ""};

        this.data.areaeffect = {value: false};
        this.data.bulky = {value: 0};
        this.data.cumbersome = {value: false};
        this.data.heavy = {value: 0};
        this.data.parry = {value: false};
        this.data.rapidfire = {value: 0};
        this.data.reliable = {value: false};
        this.data.small = {value: false};
        this.data.sniper = {value: false};
    }

    get is_reliable() {
        return this.data.data.reliable.value;
    }

    get is_sniper() {
        return this.data.data.sniper.value;
    }

    get is_areaeffect() {
        return this.data.data.areaeffect.value;
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
