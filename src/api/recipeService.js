const recipeId = import.meta.env.VITE_RECIPE_APP_ID;
const recipeKey = import.meta.env.VITE_RECIPE_APP_KEY;

export async function getRecipes(searchTerm) {
    const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchTerm}&app_id=${recipeId}&app_key=${recipeKey}`;

    try {
        console.log("Searching V2 URL:", url);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }
        
        const data = await response.json();
        return data.hits; //returns the array of recipe objects
    }   catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}

