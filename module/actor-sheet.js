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
export class SimpleActorSheet extends ActorSheet
{
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["alpha", "sheet", "actor"],
            template: "systems/alpha/templates/actor-sheet.html",
            width: 600,
            height: 600,
            tabs: [{navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "description"}],
            scrollY: [".biography", ".items", ".attributes"],
            dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
        });
    }

    /** @override */
    getData() {
        const data = super.getData();
        EntitySheetHelper.getAttributeData(data);
        data.shorthand = !!game.settings.get("alpha", "macroShorthand");
        return data;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if ( !this.options.editable ) return;

        // Handle rollable items and attributes
        html.find(".items .rollable")
            .on("click", this._onItemRoll.bind(this));
        html.find(".attributes")
            .on("click", "a.attribute-roll",
                EntitySheetHelper.onAttributeRoll.bind(this));

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

        // Handle saving of skill ranks
        html.find(".skill-rank")
            .on("input", this._submit_skill_rank.bind(this));

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
        this.actor.update_health();

        let damage = this.actor.damage;
        let i = 0;

        if (damage.length <= 0) {
            return;
        }

        i = damage.length - 1;
        while (damage[i] == 0 && i >= 0) {
            --i;
        }

        if (damage[i] <= type) {
            damage[i] = 0;
        }

        this.actor.update({'data.damage': damage});
    }

    _take_damage(type) {
        this.actor.update_health();

        let damage = this.actor.damage;
        let i = 0;
        let len = damage.length;

        for (i = 0; type <= damage[i] && i < len; i++)
            ;
        damage.splice(i, 0, type);
        damage.length = len;

        this.actor.update({'data.damage': damage});
    }

    /* checks if any core attribute has changed, and updates
     * dependant values, such as skill
     */
    _update_core_attributes(formData) {
        alpha_core_attributes.forEach((attr) => {
            let key = `data.${attr}.value`;
            if (formData[key] != undefined &&
                formData[key] != this.actor.data[key]) {
                this._update_core_attribute(attr, formData[key]);
            }
        });
    }

    _update_core_attribute(attribute_name, new_rank) {
        let skills = this.actor.data.data.skills;
        for (var skill_name in skills) {
            let skill = skills[skill_name];
            if (skill.attribute != undefined &&
                skill.attribute == attribute_name) {
                /* update modifier, and total */
                skill.attribute_modifier = new_rank;
                AlphaSkill.update_total(skill);
            }
        }
        this.actor.update({'data.skills': skills});

        /* TODO: update composite attributes such as endurance
         */
        this.actor.data.damage.length =
            parseInt(this.actor.data.health.value);
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
        let ret = this.object.update(formData);
        /* check if we need to update any dependant values
         */
        this._update_core_attributes(formData);
        return ret;
    }
}
