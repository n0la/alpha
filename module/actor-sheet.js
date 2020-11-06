import { EntitySheetHelper } from "./helper.js";

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

        html.find(".dicepool-roll")
            .on("click", this._on_dice_pool_roll.bind(this));

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

    _on_dice_pool_roll(event)
    {
        let button = $(event.currentTarget);
        let attribute = button.siblings("input")[0];
        if (attribute == undefined) {
            return;
        }
        let value = attribute.value;
        if (value == undefined || value == "" || value == 0) {
            return;
        }
        let r = new Roll(value + "d6", this.actor.getRollData());
        let success = 0;
        r.evaluate();
        r.terms[0].results.forEach(function (i, idx) {
            if (i.result >= 6) {
                success += 2;
            } else if (i.result >= 4) {
                success += 1;
            }
        });
        r.toMessage({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({actor: this.actor}),
            flavor: `<h2>Successes: ${success}</h2>`
        });
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
