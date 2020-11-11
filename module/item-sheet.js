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
            new_object._initialize();
            new_object.data = Object.assign(
                {},
                new_object.data,
                this.object.data
            );
            new_object.data.data = Object.assign(
                {},
                new_object.data.data,
                this.object.data.data
            );
            this.object = new_object;
        }
    }
}
