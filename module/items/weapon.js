import { AlphaItem } from './item.js'

export class AlphaWeapon extends AlphaItem {

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