export function recipeTemplate(recipe) {

    const ingredientsData = encodeURIComponent(JSON.stringify(recipe.ingredientLines));
    
    return `
        <div class="recipe-card fade-in" data-id="${recipe.uri}" data-ingredients="${ingredientsData}">
            <img src="${recipe.image}" alt="${recipe.label}" loading="lazy">
            <div class="recipe-content">
                <h3>${recipe.label}</h3>
                
                <p><strong>Source:</strong> ${recipe.source}</p>
                <p><strong>Calories:</strong> <span class="total-calories">${Math.round(recipe.calories)}</span></p>
                
                <hr>
                
                <p><strong>Original Yield:</strong> <span class="orig-yield">${recipe.yield}</span> servings</p>
                
                <div class="scaler-box">
                    <label for="target-${recipe.uri}">Adjust Servings:</label>
                    <input type="number" class="servings-input" id="target-${recipe.uri}" value="${recipe.yield}" min="1">
                </div>

                <div class="ingredient-list">
                    <h4>Ingredients (Scaled):</h4>
                    <ul>
                        ${recipe.ingredients.map(ing => `
                            <li>
                                <span class="amt" data-orig="${ing.quantity || 0}">${ing.quantity ? Math.round(ing.quantity * 100) / 100 : ''}</span> 
                                ${ing.measure || ''} ${ing.food}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="card-buttons">
                    <a href="${recipe.url}" target="_blank" class="view-btn">View Full Recipe</a>
                    <button class="nutrition-btn">Nutrition Info</button>
                    <button class="save-btn">❤️ Save</button>
                </div>
            </div>
        </div>
    `;
}
