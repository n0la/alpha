/**
 * All skills the Alpha system has to offer
 */
export const alpha_skills = [
    { "name": "Athletics", "id": "athletics", "attribute": "physique" },
    { "name": "Command", "id": "command", "attribute": "psyche" },
    { "name": "Commerce", "id": "commerce", "attribute": "psyche" },
    { "name": "Culture", "id": "culture", "attribute": "psyche" },
    { "name": "Dexterity", "id": "dexterity", "attribute": "motorics" },
    { "name": "Force", "id": "force", "attribute": "physique" },
    { "name": "Gunnery", "id": "gunnery", "attribute": "intellect" },
    { "name": "Manipulation", "id": "manipulation", "attribute": "psyche" },
    { "name": "Mechanics", "id": "mechanics", "attribute": "motorics" },
    { "name": "Melee Comabt", "id": "meleecombat", "attribute": "physique" },
    { "name": "Observation", "id": "observation", "attribute": "intellect" },
    { "name": "Pilot", "id": "pilot", "attribute": "motorics" },
    { "name": "Ranged Combat", "id": "rangedcombat", "attribute": "motorics" },
    { "name": "Science", "id": "science", "attribute": "intellect" },
    { "name": "Stealth", "id": "stealth", "attribute": "motorics" },
    { "name": "Survival", "id": "survival", "attribute": "intellect" }
];

export class AlphaSkill
{
    constructor(slug) {
        this.name = slug.name;
        this.id = slug.id;
        this.attribute = slug.attribute;
        this.attribute_value = 0;
        this.modifier = 0;
        this.rank = 0;
    }

    get total() {
        return this.attribute_value + this.rank + this.modifier;
    }
};
