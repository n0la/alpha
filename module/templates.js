/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function()
{
    // Define template paths to load
    const templatePaths = [
        // Attribute list partial.
        "systems/alpha/templates/parts/sheet-attributes.html",
        "systems/alpha/templates/parts/sheet-groups.html",
        "systems/alpha/templates/parts/sheet-item-header.html",
        "systems/alpha/templates/parts/sheet-item-description.html"
    ];

    // Load the template parts
    return loadTemplates(templatePaths);
};
