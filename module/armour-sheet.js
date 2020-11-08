import { AlphaArmour } from "./items.js";
import { AlphaItemSheet } from "./item-sheet.js";
import { AlphaSkill } from "./alpha-system.js";
import { RollHelper } from "./helper.js";

export class AlphaArmourSheet extends AlphaItemSheet
{
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["alpha", "sheet", "armour"],
            template: "systems/alpha/templates/armour-sheet.html",
            width: 520,
            height: 480,
            tabs: [{navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "description"}],
            scrollY: [".attributes"]
        });
    };

    /** @override */
    getData() {
        let data = super.getData();
        return data;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
    }

    /** @override */
    _updateObject(event, formdata) {
        this.updateObjectType(AlphaArmour);
        return this.object.update(formdata);
    }
}
