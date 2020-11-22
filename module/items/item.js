import { AlphaItemSheet } from "./sheets/item.js";
import { AlphaArmourSheet } from "./sheets/armour.js";
import { AlphaWeaponSheet } from "./sheets/weapon.js";

export class AlphaItem extends Item {
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
    types: ["armor"],
    makeDefault: true
  });
  Items.registerSheet("alpha", AlphaWeaponSheet, {
    types: ["weapon"],
    makeDefault: true
  });
}
