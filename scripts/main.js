async function ownerPotencyEnricher (match, options) {
  const attribute = match[2].toUpperCase();
  const attributeLetter = match[2][0].toUpperCase();
  const strength = match[3].toLowerCase();
  const defaultReturnVal = match[0];
  const ownerUuid = options?.relativeTo?.parent?.flags?.world?.ownerUuid ?? null;
  if (!ownerUuid || !strength in ds.CONST.potencyStrengths) {
    return defaultReturnVal;
  }
  let strengthValue = 0;
  if (strength == "weak") {
    strengthValue = -2;
  } else if (strength == "average") {
    strengthValue = -1;
  }
  const owner = foundry.utils.fromUuidSync(ownerUuid);
  if (!owner) {
    return defaultReturnVal;
  }
  return constructPotencyHTML(attribute[0], owner.system.characteristics.reason.value + strengthValue);
}

async function constructPotencyHTML(characteristic, strength) {

  if (strength in ds.CONST.potencyStrengths) strength = ds.CONST.potencyStrengths[strength].glyph;
  // Numeric glyphs are formatted with square edges on both sides
  // Append right bracket to get the rounded edge on the end.
  else if (typeof strength === "number") strength = `${strength}]`;

  const potencyString = _loc("DRAW_STEEL.Item.ability.Potency.Embed", {
    characteristic,
    value: strength,
  });

  const span = document.createElement("span");
  span.classList.add("potency");
  span.textContent = potencyString;

  return span;
}

const re = /\[\[(owner_potency|op) (Might|Agility|Reason|Intuition|Presence|M|A|R|I|P) (weak|average|strong|\d)\]\]/gi;

const enricherConfig = {
  pattern: re,
  enricher: ownerPotencyEnricher,
  replaceParent: false
};

Hooks.on("init", () => {
    console.log(`draw-steel-summoner-class | Initializing Draw Steel - Summoner Class`);
    CONFIG.TextEditor.enrichers.push(enricherConfig);
});