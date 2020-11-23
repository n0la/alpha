import { AlphaArmor } from "./items/armor.js";
import { AlphaWeapon } from "./items/weapon.js";
import { AlphaItem } from "./items/item.js";

function factory(entities, baseClass) {
    return new Proxy(baseClass, {
        construct: (target, args) => {
            const [data, options] = args;
            const constructor = entities[data.type];
            if (!constructor) {
                throw new Error("Unsupported Entity type for create(): " + data.type);
            }
            return new constructor(data, options);
        },
        get: (target, prop) => {
            switch (prop) {
              case "create":
                //Calling the class' create() static function
                return function (data, options) {
                  const constructor = entities[data.type];

                  if (!constructor) {
                    throw new Error(
                      "Unsupported Entity type for create(): " + data.type
                    );
                  }
                  return constructor.create(data, options);
                };

              case Symbol.hasInstance:
                //Applying the "instanceof" operator on the instance object
                return function (instance) {
                  const constr = entities[instance.data.type];
                  if (!constr) {
                    return false;
                  }
                  return instance instanceof constr;
                };
              default:
                //Just forward any requested properties to the base Actor class
                return baseClass[prop];
            }
        }
    });
}

const itemTypes = {
  item: AlphaItem,
  armor: AlphaArmor,
  weapon: AlphaWeapon
};

export const itemConstructor = factory(itemTypes, Item);