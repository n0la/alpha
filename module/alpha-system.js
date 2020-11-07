/**
 * All skills the Alpha system has to offer
 */
export const ALPHA_SKILLS = [
  { name: 'Athletics', id: 'athletics', attribute: 'physique' },
  { name: 'Command', id: 'command', attribute: 'psyche' },
  { name: 'Commerce', id: 'commerce', attribute: 'psyche' },
  { name: 'Culture', id: 'culture', attribute: 'psyche' },
  { name: 'Dexterity', id: 'dexterity', attribute: 'motorics' },
  { name: 'Force', id: 'force', attribute: 'physique' },
  { name: 'Gunnery', id: 'gunnery', attribute: 'intellect' },
  { name: 'Manipulation', id: 'manipulation', attribute: 'psyche' },
  { name: 'Mechanics', id: 'mechanics', attribute: 'motorics' },
  { name: 'Melee Comabt', id: 'meleecombat', attribute: 'physique' },
  { name: 'Observation', id: 'observation', attribute: 'intellect' },
  { name: 'Pilot', id: 'pilot', attribute: 'motorics' },
  { name: 'Ranged Combat', id: 'rangedcombat', attribute: 'motorics' },
  { name: 'Science', id: 'science', attribute: 'intellect' },
  { name: 'Stealth', id: 'stealth', attribute: 'motorics' },
  { name: 'Survival', id: 'survival', attribute: 'intellect' },
]

export const ALPHA_CORE_ATTRIBUTES = [
  { name: 'Physique', short: 'PHY', id: 'physique' },
  { name: 'Motorics', short: 'MOT', id: 'motorics' },
  { name: 'Intellect', short: 'INT', id: 'intellect' },
  { name: 'Psyche', short: 'PSY', id: 'psyche' },
]

/* Theoretically this represents a skill of a player. But sadly Foundry
* cannot store objects with attributes/functions server side, unless they
* are entities. And making our own entities blows the scope of this little
* project quite a bit.
*/
export class AlphaSkill {
  constructor (slug) {
    this.name = slug.name
    this.id = slug.id
    this.attribute = slug.attribute
    this.attribute_modifier = 0
    this.modifier = 0
    this.total = 0
    this.rank = 0
  }

  static update_total (skill) {
    skill.total = skill.rank + skill.modifier + skill.attribute_modifier
  }
};
