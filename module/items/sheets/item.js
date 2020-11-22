export class AlphaItemSheet extends ItemSheet {
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
}
