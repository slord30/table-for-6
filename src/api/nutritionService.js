import { NUTRITION_APP_ID, NUTRITION_APP_KEY, RECIPE_APP_ID, RECIPE_APP_KEY } from "../../../env.js";

export async function getNutritionDetails(recipeLabel, ingredientLines) {
    const url = `https://api.edamam.com/api/nutrition-details?app_id=${NUTRITION_APP_ID}&app_key=${NUTRITION_APP_KEY}`;

    const recipeData = {
        title: recipeLabel,
        ingr: ingredientLines, 
        yield: 1
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recipeData)
        });
        const data = await response.json();

        console.log("FULL API RESPONSE:", data);

        if (!response.ok) {
            console.error("Edamam Detailed Error:", data);
            throw new Error(`Nutrition error: ${response.status}`);
        }
        return data;
        
    } catch (error) {
        console.error("Nutrition Error:", error);
        return null; 
    }
}