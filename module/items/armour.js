import { AlphaItem } from './item.js'

export class AlphaArmour extends AlphaItem
{
    /** @override */
    _initialize() {
        super._initialize();

        this.prepateData({
            rating: {value: 0},
            hazard: {value: 0},
            sealed: {value: false}
        })
    }
}
