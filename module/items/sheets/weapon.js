import { AlphaSkill } from "../../alpha-system.js";
import { RollHelper } from "../../helper.js";

export class AlphaWeaponSheet extends ItemSheet
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
    activateListeners(html) {
        super.activateListeners(html);

        html.find(".attack-roll")
            .on("click", this._on_attack_roll.bind(this));
        html.find(".aimed-attack-roll")
            .on("click", this._on_aimed_attack_roll.bind(this));
    }

    _get_extra_info() {
        const effect = (this.object.is_areaeffect ? "Yes" : "No");
        return `<h3>AP: ${this.object.data.data.ap.value} / ` +
            `DMG: ${this.object.data.data.damage.value} / ` +
            `Area of Effect: ${effect}</h3>`
    }

    _on_attack_roll(event) {
        this._make_attack_roll(false);
    }

    _on_aimed_attack_roll(event) {
        this._make_attack_roll(true);
    }

    _make_attack_roll(aimed = false) {
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
              // owner skill
              parseInt(owner_total) +
              // any extra item bonuses
              parseInt(item_total) +
              // reliable weapons give + 1
              (this.object.is_reliable ? 1 : 0) +
              // Are we aiming? yes = another + 1
              (aimed ? 1 : 0) +
              // Are we aiming with a sniper? yes = +1
              (aimed && this.object.is_sniper ? 1 : 0);

        if (total == 0) {
            return;
        }

        RollHelper.roll_dice_pool(
            total, this.object.actor,
            `Attack with ${this.object.name}`,
            this._get_extra_info()
        );
    }
}
