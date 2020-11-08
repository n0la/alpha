import { AlphaWeapon } from "./items.js";
import { AlphaItemSheet } from "./item-sheet.js";
import { AlphaSkill } from "./alpha-system.js";

export class AlphaWeaponSheet extends AlphaItemSheet
{
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["alpha", "sheet", "weapon"],
            template: "systems/alpha/templates/weapon-sheet.html",
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

        html.find(".attack-roll")
            .on("click", this._on_attack_roll.bind(this));
    }

    _on_attack_roll(event) {
        if (!this.object.isOwned) {
            return;
        }

        let skill = this.object.data.data.skill;
        if (skill == undefined || skill == "" ||
            AlphaSkill.ALL_SKILLS[skill] == undefined) {
            return;
        }

        let owner = this.object.actor;
    }

    /** @override */
    _updateObject(event, formdata) {
        this.updateObjectType(AlphaWeapon);
        return this.object.update(formdata);
    }
}
