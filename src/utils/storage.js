export function saveRecipe(recipe) {

    const favorites = JSON.parse(localStorage.getItem('table6_favorites')) || [];
    
   
    const exists = favorites.some(fav => fav.uri === recipe.uri);
    if (!exists) {
        favorites.push(recipe);
        localStorage.setItem('table6_favorites', JSON.stringify(favorites));
        return true;
    }
    return false;
}

export function getFavorites() {
    return JSON.parse(localStorage.getItem('table6_favorites')) || [];
}
