import { AlphaItem } from './item.js'

export class AlphaArmor extends AlphaItem {

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
