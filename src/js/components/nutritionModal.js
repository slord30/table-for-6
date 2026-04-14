export const nutritionTemplate = (data, ratio = 1) => {
    if (!data) return `<p class="error-msg">Sorry, detailed nutrition data is unavailable for this recipe.</p>`;

    let nutrients = data.totalNutrients;

    if (!nutrients && data.ingredients) {
        nutrients = data.ingredients.reduce((acc, ing) => {

            const ingNutrients = ing.parsed?.[0]?.nutrients;
            if (ingNutrients) {
                Object.keys(ingNutrients).forEach(key => {
                    if (!acc[key]) acc[key] = { quantity: 0 };
                    acc[key].quantity += ingNutrients[key].quantity;
                });
            }
            return acc;
        }, {});
    }

    if (!nutrients || Object.keys(nutrients).length === 0) {
        return `<p>Sorry, nutrition data is unavailable for this recipe.</p>`;
    }

    const calories = Math.round((data.calories || nutrients.ENERC_KCAL?.quantity || 0) * ratio);
    const protein = Math.round((nutrients.PROCNT?.quantity || 0) * ratio);
    const fat = Math.round((nutrients.FAT?.quantity || 0) * ratio);
    const carbs = Math.round((nutrients.CHOCDF?.quantity || 0) * ratio);

    return `
        <div class="macro-grid">
            <div class="macro-item">
                <span class="macro-label">Calories</span>
                <span class="macro-value">${calories}</span>
            </div>
            <div class="macro-item">
                <span class="macro-label">Protein</span>
                <span class="macro-value">${protein}g</span>
            </div>
            <div class="macro-item">
                <span class="macro-label">Fat</span>
                <span class="macro-value">${fat}g</span>
            </div>
            <div class="macro-item">
                <span class="macro-label">Carbs</span>
                <span class="macro-value">${carbs}g</span>
            </div>
        </div>
        <p class="disclaimer">Nutritional info is based on Edamam Analysis.</p>
    `;
};