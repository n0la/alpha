import { EntitySheetHelper } from "./helper.js";
import { AlphaSkill } from "./alpha-system.js";

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

    _roll_dicepool(sides, flavour) {
        let r = new Roll(sides + "d6", this.actor.getRollData());
        let success = 0;
        let f = "";
        r.evaluate();
        r.terms[0].results.forEach(function (i, idx) {
            if (i.result >= 6) {
                success += 2;
            } else if (i.result >= 4) {
                success += 1;
            }
        });

        if (flavour == undefined) {
            f = `<h2>Successes: ${success}</h2>`;
        } else {
            f = `<h2>${flavour}: ${success} Successes</h2>`;
        }

        r.toMessage({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({actor: this.actor}),
            flavor: f
        });

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
        this._roll_dicepool(value, skill_name);
    }

    _on_attribute_roll(event)
    {
        let button = $(event.currentTarget);
        let attribute = button.siblings("input")[0];
        let attribute_name = attribute.id;
        if (attribute == undefined) {
            return;
        }
        let value = attribute.value;
        if (value == undefined || value == "" || value == 0) {
            return;
        }
        this._roll_dicepool(value, attribute_name);
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
        return this.object.update(formData);
    }
}
