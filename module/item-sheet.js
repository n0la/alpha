import { EntitySheetHelper } from "./helper.js";
import { AlphaItem } from "./items.js";

export class AlphaItemSheet extends ItemSheet
{
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["alpha", "sheet", "item"],
            template: "systems/alpha/templates/item-sheet.html",
            width: 520,
            height: 480,
            tabs: [{navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "description"}],
            scrollY: [".attributes"],
        });
    }

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
    _updateObject(event, formData)
    {
        return this.object.update(formData);
    }

    /**
     * Changes the type of the underlying Item. This should be
     * called in _updateObject() so that the derived item sheet
     * has the proper underlying object of the proper type around
     */
    updateObjectType(objectType) {
        if (!(this.object instanceof objectType)) {
            let new_object = new objectType;
            this.object = Object.assign(new_object, this.object);
        }
    }
}

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class SimpleItemSheet extends ItemSheet
{
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["alpha", "sheet", "item"],
            template: "systems/alpha/templates/item-sheet.html",
            width: 520,
            height: 480,
            tabs: [{navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "description"}],
            scrollY: [".attributes"],
        });
    }

    /** @override */
    getData() {
        const data = super.getData();
        EntitySheetHelper.getAttributeData(data);
        return data;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        // Rollable attributes
        html.find(".attributes")
            .on("click", "a.attribute-roll",
                EntitySheetHelper.onAttributeRoll.bind(this));

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

    /** @override */
    _updateObject(event, formData)
    {
        // Handle attribute and group updates.
        formData = EntitySheetHelper.updateAttributes(formData, this);
        formData = EntitySheetHelper.updateGroups(formData, this);

        // Update the Actor with the new form values.
        return this.object.update(formData);
    }
}
