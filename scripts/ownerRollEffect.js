function constructPotencyHTML(characteristic, strength) {
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
  return span.outerHTML;
}

function replacePotencyText(result, summonerReason) {
  const characteristics = ["M", "A", "R", "I", "P"];
  if (summonerReason) {
    for(let i = 0; i < characteristics.length; i++) {
        result = result.replaceAll(`[[op ${characteristics[i]} weak]]`, constructPotencyHTML(characteristics[i], summonerReason - 2));
        result = result.replaceAll(`[[op ${characteristics[i]} average]]`, constructPotencyHTML(characteristics[i], summonerReason - 1));
        result = result.replaceAll(`[[op ${characteristics[i]} strong]]`, constructPotencyHTML(characteristics[i], summonerReason));
    }
  } else {
    for(let i = 0; i < characteristics.length; i++) {
        result = result.replaceAll(`[[op ${characteristics[i]} weak]]`, constructPotencyHTML(characteristics[i], "weak"));
        result = result.replaceAll(`[[op ${characteristics[i]} average]]`, constructPotencyHTML(characteristics[i], "average"));
        result = result.replaceAll(`[[op ${characteristics[i]} strong]]`, constructPotencyHTML(characteristics[i], "strong"));
    }
  }
  return result;
}

export default class AppliedSummonerPowerRollEffect extends ds.data.pseudoDocuments.powerRollEffects.AppliedPowerRollEffect {
  /**
   * @param {1 | 2 | 3} tier
   * @inheritdoc
   */
  toText(tier) {
    let result = super.toText(tier);
    const ownerUuid = this.actor?.flags?.world?.ownerUuid;
    const summonerReason = fromUuidSync(ownerUuid)?.system?.characteristics?.reason?.value
    return replacePotencyText(result, summonerReason);
  }
}