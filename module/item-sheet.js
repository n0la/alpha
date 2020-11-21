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
        super._updateObject(event, formData);
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
