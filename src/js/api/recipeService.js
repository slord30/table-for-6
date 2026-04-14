const recipeId = import.meta.env.VITE_RECIPE_APP_ID;
const recipeKey = import.meta.env.VITE_RECIPE_APP_KEY;

export async function getRecipes(searchTerm, filters = []) {
  // const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchTerm}&app_id=${recipeId}&app_key=${recipeKey}`;

  const url = new URL("https://api.edamam.com/api/recipes/v2");

  url.searchParams.append("type", "public");
  url.searchParams.append("q", searchTerm);
  url.searchParams.append("app_id", recipeId);
  url.searchParams.append("app_key", recipeKey);

  filters.forEach((filter) => {
    // Edamam uses 'diet' for things like 'high-protein' and health for things like 'vegan'
    const dietLabels = [
      "high-protein",
      "balanced",
      "low-fat",
      "low-carb",
      "high-fiber",
    ];
    const paramType = dietLabels.includes(filter) ? "diet" : "health";
    url.searchParams.append(paramType, filter);
  });

  try {
    console.log("Searching V2 URL:", url);
    const response = await fetch(url.href);

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();
    return data.hits; //returns the array of recipe objects
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}
