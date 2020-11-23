import { AlphaItemSheet } from "./sheets/item.js";
import { AlphaArmourSheet } from "./sheets/armour.js";
import { AlphaWeaponSheet } from "./sheets/weapon.js";

export class AlphaItem extends Item {
    /** @override */
    _initialize() {
        super._initialize();

        this.prepateData({
            resources: {value: 0},
            value: {value: 0},
            weight: {value: 0},
            quantity: {value: 0},
            description: {value: ""},

            bulky: {value: 0},
            cumbersome: {value: false},
            reliable: {value: false},
            small: {value: false},
        })
    }

    prepateData (data) {
        this.data.data = Object.assign(
            {},
            data,
            (this.data.data || {})
        );
    }

    get type() {
        return super.type;
    }
}

export function RegisterItemSheets() {
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("alpha", AlphaItemSheet, {
        types: ["item"],
        makeDefault: true
    });
    Items.registerSheet("alpha", AlphaArmourSheet, {
        types: ["armour"],
        makeDefault: true
    });
    Items.registerSheet("alpha", AlphaWeaponSheet, {
        types: ["weapon"],
        makeDefault: true
    });
}
