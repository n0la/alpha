import { AlphaWeapon } from "./items.js";
import { AlphaItemSheet } from "./item-sheet.js";
import { AlphaSkill } from "./alpha-system.js";
import { RollHelper } from "./helper.js";

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

    _get_extra_info() {
        return `<h3>AP: ${this.object.data.data.ap.value}</h3>` +
            `<h3>DMG: ${this.object.data.data.damage.value}</h3>`
    }

    _on_attack_roll(event) {
        if (!this.object.isOwned) {
            return;
        }

        const skill_name = this.object.data.data.skill.value;
        if (skill_name == undefined ||
            skill_name == "" ||
            AlphaSkill.ALL_SKILLS[skill_name] == undefined) {
            return;
        }

        const owner = this.object.actor;
        const owner_total = owner.data.data.skills[skill_name].total;
        const item_total = this.object.data.data.attack_bonus.value;
        const total =
              parseInt(owner_total) +
              parseInt(item_total);

        if (total == 0) {
            return;
        }

        RollHelper.roll_dice_pool(
            total, this.object.actor,
            `Attack with ${this.object.name}`,
            this._get_extra_info()
        );
    }

    /** @override */
    _updateObject(event, formdata) {
        this.updateObjectType(AlphaWeapon);
        return this.object.update(formdata);
    }
}
