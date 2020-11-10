export class AlphaItem extends Item
{
    /** @override */
    _initialize() {
        super._initialize();

        const initial_values = {
            resources: {value: 0},
            value: {value: 0},
            weight: {value: 0},
            quantity: {value: 0},
            description: {value: ""},

            areaeffect: {value: false},
            bulky: {value: 0},
            cumbersome: {value: false},
            heavy: {value: 0},
            parry: {value: false},
            rapidfire: {value: 0},
            reliable: {value: false},
            small: {value: false},
            sniper: {value: false}
        };

        let neu = Object.assign(
            {},
            initial_values,
            (this.data.data || {})
        );
        this.data.data = neu;
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

        const initial_values = {
            skill: {value: "rangedcombat"},
            ap: {value: 0},
            damage: {value: 0},
            ammo: {value: 0, max: 0},
            magazines: {value: 0, max: 0},
            range: {value: "close"},
            salvo: {value: 0},
            attack_bonus: {value: 0},
            throwable: {value: false}
        };

        let neu = Object.assign(
            {},
            initial_values,
            (this.data.data || {})
        );
        this.data.data = neu;
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

export class AlphaArmour extends AlphaItem
{
    /** @override */
    _initialize() {
        super._initialize();

        const initial_values = {
            rating: {value: 0},
            hazard: {value: 0},
            sealed: {value: false}
        };

        let neu = Object.assign(
            {},
            initial_values,
            (this.data.data || {})
        );
        this.data.data = neu;
    }
}
