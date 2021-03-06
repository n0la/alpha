import { EntitySheetHelper } from "./helper.js";
import { RollHelper } from "./helper.js";
import {
    AlphaSkill,
    alpha_core_attributes
} from "./alpha-system.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class AlphaActorSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["alpha", "sheet", "actor"],
            template: "systems/alpha/templates/actor-sheet.html",
            width: 600,
            height: 600,
            tabs: [{navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "description"}],
            scrollY: [".biography", ".items", ".attributes", ".skills"],
            dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
        });
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if ( !this.options.editable ) return;

        // Handle rollable items and attributes
        html.find(".items .rollable")
            .on("click", this._onItemRoll.bind(this));

        // Damage links
        html.find(".take-shocking-damage")
            .on("click", this._take_damage.bind(this, 1));
        html.find(".take-lethal-damage")
            .on("click", this._take_damage.bind(this, 2));
        html.find(".take-brutal-damage")
            .on("click", this._take_damage.bind(this, 3));
        // Heal damage
        html.find(".heal-shocking-damage")
            .on("click", this._heal_damage.bind(this, 1));
        html.find(".heal-lethal-damage")
            .on("click", this._heal_damage.bind(this, 2));
        html.find(".heal-brutal-damage")
            .on("click", this._heal_damage.bind(this, 3));

        // Same for sanity
        html.find(".take-shaking-damage")
            .on("click", this._take_sanity_damage.bind(this, 1));
        html.find(".take-dread-damage")
            .on("click", this._take_sanity_damage.bind(this, 2));
        html.find(".take-despair-damage")
            .on("click", this._take_sanity_damage.bind(this, 3));
        // Heal damage
        html.find(".heal-shaking-damage")
            .on("click", this._heal_sanity_damage.bind(this, 1));
        html.find(".heal-dread-damage")
            .on("click", this._heal_sanity_damage.bind(this, 2));
        html.find(".heal-despair-damage")
            .on("click", this._heal_sanity_damage.bind(this, 3));

        // Handle rolling attributes
        html.find(".attribute-roll")
            .on("click", this._on_attribute_roll.bind(this));

        // Handle rolling of skills
        html.find(".skill-roll")
            .on("click", this._on_skill_roll.bind(this));

        // Update Inventory Item
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.getOwnedItem(li.data("itemId"));
            item.sheet.render(true);
        });

        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            this.actor.deleteOwnedItem(li.data("itemId"));
            li.slideUp(200, () => this.render(false));
        });

        // Add draggable for macros.
        html.find(".attributes a.attribute-roll").each((i, a) => {
            a.setAttribute("draggable", true);
            a.addEventListener("dragstart", ev => {
                let dragData = ev.currentTarget.dataset;
                ev.dataTransfer.setData('text/plain', JSON.stringify(dragData));
            }, false);
        });

        // Add or Remove Attribute
        html.find(".attributes")
            .on("click", ".attribute-control",
                EntitySheetHelper.onClickAttributeControl.bind(this));

        // Add attribute groups.
        html.find(".groups")
            .on("click", ".group-control",
                EntitySheetHelper.onClickAttributeGroupControl.bind(this));
    }

    _heal_damage(type) {
        this.actor.update_damage();

        let damage = this.actor.damage;
        if (damage.length <= 0) {
            return;
        }

        const i = damage.findIndex((v) => v <= type);
        if (i == -1) {
            return;
        }

        damage.splice(i, 1);
        damage.push(0);

        this.actor.update({'data.damage': damage});
    }

    _heal_sanity_damage(type) {
        this.actor.update_sanity();

        let sanity = this.actor.sanity;
        if (sanity.length <= 0) {
            return;
        }

        const i = sanity.findIndex((v) => v <= type);
        if (i == -1) {
            return;
        }

        sanity.splice(i, 1);
        sanity.push(0);

        this.actor.update({'data.sanity': sanity});
    }

    _take_damage(type) {
        this.actor.update_damage();

        let damage = this.actor.damage;
        let i = 0;
        let len = damage.length;

        for (i = 0; type <= damage[i] && i < len; i++)
            ;
        damage.splice(i, 0, type);
        damage.length = len;

        this.actor.update({'data.damage': damage});
    }

    _take_sanity_damage(type) {
        this.actor.update_sanity();

        let sanity = this.actor.sanity;
        let i = 0;
        let len = sanity.length;

        for (i = 0; type <= sanity[i] && i < len; i++)
            ;
        sanity.splice(i, 0, type);
        sanity.length = len;

        this.actor.update({'data.sanity': sanity});
    }

    _update_damage(formData) {
        const neu = formData["data.resilience.value"];

        if (neu == null) {
            return formData;
        }

        if (neu != this.object.resilience) {
            this.object.resilience = neu;
            this.object.update_damage();
            formData['data.damage'] = this.object.damage;
        }

        return formData;
    }

    _update_sanity(formData) {
        const neu = formData["data.willpower.value"];

        if (neu == null) {
            return formData;
        }

        if (neu != this.object.willpower) {
            this.object.willpower = neu;
            this.object.update_sanity();
            formData['data.sanity'] = this.object.sanity;
        }

        return formData;
    }

    /* checks if any core attribute has changed, and updates
     * dependant values, such as skill
     */
    _update_core_attributes(formData) {
        alpha_core_attributes.forEach((attr) => {
            let key = `data.${attr}.value`;
            if (formData[key] == undefined ||
                formData[key] == this.actor.data[key]) {
                return;
            }

            /* core attribute has changed, update affected skills
             */
            formData = this._update_core_attribute(
                formData, attr, formData[key]
            );
        });

        return formData;
    }

    _update_core_attribute(formData, attribute_name, new_rank) {
        let skills = this.actor.data.data.skills;
        for (var skill_name in skills) {
            let skill = skills[skill_name];
            if (skill.attribute == undefined ||
                skill.attribute != attribute_name) {
                continue;
            }

            const total = skill.total;
            /* update modifier, and total */
            skill.attribute_modifier = new_rank;
            AlphaSkill.update_total(skill);
            if (total != skill.total) {
                formData[`data.skills.${skill.id}.attribute_modifier`] =
                    new_rank;
                formData[`data.skills.${skill.id}.total`] = skill.total;
            }
        }

        return formData;
    }

    _update_skills(formdata) {
        for (var skill in this.object.skills) {
            let s = this.object.skills[skill];
            let rank = `data.skills.${s.id}.rank`;
            let modifier = `data.skills.${s.id}.modifier`;
            if (formdata[rank] != null || formdata[modifier] != null) {
                const total = parseInt(s.total);

                s.rank = parseInt(formdata[rank]);
                s.modifier = parseInt(formdata[modifier]);
                AlphaSkill.update_total(s);

                if (s.total != total) {
                    formdata[`data.skills.${s.id}.total`] = s.total;
                }
            }
        }

        return formdata;
    }

    _submit_skill_rank(event) {
        let input = $(event.currentTarget);
        let id = input[0].id.replace("-rank", "");
        let rank = input[0].value;

        if (id == undefined || rank == undefined) {
            return;
        }

        let skills = this.actor.data.data.skills;
        skills[id].rank = parseInt(rank);
        AlphaSkill.update_total(skills[id]);
        this.actor.update({'data.skills': skills});
    }

    _on_skill_roll(event)
    {
        let button = $(event.currentTarget);
        let skill_name = button[0].id.replace("-roll", "");
        let total = button.siblings("input.total")[0];
        if (total == undefined) {
            return;
        }
        let value = total.value;
        if (value == undefined || value == "" || value == 0) {
            return;
        }
        RollHelper.roll_dice_pool(value, this.actor, skill_name);
    }

    _on_attribute_roll(event)
    {
        let button = $(event.currentTarget);
        let attribute = button.siblings("input")[0];
        let attribute_name = attribute.id;
        if (attribute == undefined) {
            return;
        }
        const value = attribute.value;
        if (value == undefined || value == "" || value == 0) {
            return;
        }
        const nm = attribute_name.charAt(0).toUpperCase() +
              attribute_name.slice(1);
        RollHelper.roll_dice_pool(value, this.actor, nm);
    }

    /**
     * Listen for roll buttons on items.
     * @param {MouseEvent} event    The originating left click event
     */
    _onItemRoll(event)
    {
        let button = $(event.currentTarget);
        let r = new Roll(button.data('roll'), this.actor.getRollData());
        const li = button.parents(".item");
        const item = this.actor.getOwnedItem(li.data("itemId"));
        r.roll().toMessage({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: `<h2>${item.name}</h2><h3>${button.text()}</h3>`
        });
    }

    /** @override */
    _updateObject(event, formData) {
        formData = EntitySheetHelper.updateAttributes(formData, this);
        formData = EntitySheetHelper.updateGroups(formData, this);

        /* update skills if attributes change
         */
        formData = this._update_core_attributes(formData);
        /* update skill totals
         */
        formData = this._update_skills(formData);
        /* update health
         */
        formData = this._update_damage(formData);
        /* and sanity
         */
        formData = this._update_sanity(formData);

        return this.object.update(formData);
    }
}
