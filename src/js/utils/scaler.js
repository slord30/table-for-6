export function calculateScaledAmount(originalAmount, orginalYield, targetServings) {
    if (!originalAmount || !orginalYield || !targetServings) return originalAmount;

    //multiplying
    const multiplier = targetServings / orginalYield;
    const newAmount = originalAmount * multiplier;

    //round results
    return Math.round(newAmount * 100) / 100;

}