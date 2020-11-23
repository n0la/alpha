import { EntitySheetHelper } from "./helper.js";
import { alpha_skills, AlphaSkill } from "./alpha-system.js";

/**
 * Extend the base Actor entity by defining a custom roll data structure
 * which is ideal for the Simple system.
 * @extends {Actor}
 */
export class AlphaActor extends Actor
{
    /** @override */
    prepareData() {
        super.prepareData();
        this.data.data.groups = this.data.data.groups || {};
        this.data.data.attributes = this.data.data.attributes || {};
    }

    update_damage() {
        if (this.damage == null) {
            this.damage = [];
        }
        if (this.damage.length != this.resilience) {
            this.damage.length = this.resilience;
            let damage = [...this.damage].map(
                v => v == null ? 0 : v
            );
            this.damage = damage;
        }
    }

    update_sanity() {
        if (this.sanity == null) {
            this.sanity = [];
        }
        if (this.sanity.length != this.willpower) {
            this.sanity.length = this.willpower;
            let sanity = [...this.sanity].map(
                v => v == null ? 0 : v
            );
            this.sanity = sanity;
        }
    }

    /** @override */
    _initialize() {
        super._initialize();

        const initial_values = {
            description: {value: ""},

            xp: {value: 0},
            level: {value: 1},

            physique: {value: 1},
            motorics: {value: 1},
            intellect: {value: 1},
            psyche: {value: 1},

            composure: {value: 0},
            endurance: {value: 0},
            damage: [],
            focus: {value: 0},
            vigilance: {value: 0},

            pace: {value: 6},
            size: {value: 5},

            resilience: {value: 0},
            willpower: {value: 0},
            sanity: [],

            defence: {value: 0},
            armour: {value: 0},

            wealth: {value: 0},
            resources: {value: 0},
            tradegoods: {value: 0}
        };

        let neu = Object.assign(
            {},
            initial_values,
            (this.data.data || {})
        );

        this.data.data = neu;

        if (this.skills == null) {
            this.skills = {};
            alpha_skills.forEach((s) => {
                this.skills[s.id] = new AlphaSkill(s);
                this.skills[s.id].attribute_modifier = 1;
            });
        }

        this.update_damage();
        this.update_sanity();
    }

    get skills() {
        return this.data.data.skills;
    }

    set skills(value) {
        this.data.data.skills = value;
    }

    get resilience() {
        return this.data.data.resilience.value;
    }

    set resilience(value) {
        this.data.data.resilience.value = parseInt(value);
    }

    get willpower() {
        return this.data.data.willpower.value;
    }

    set willpower(value) {
        this.data.data.willpower.value = parseInt(value);
    }

    get damage() {
        return this.data.data.damage;
    }

    set damage(value) {
        this.data.data.damage = value;
    }

    get sanity() {
        return this.data.data.sanity;
    }

    set sanity(value) {
        this.data.data.sanity = value;
    }
}
