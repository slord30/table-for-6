// src/js/utils/storage.js

export function saveRecipe(recipe) {
    // 1. Get existing data
    let favorites = JSON.parse(localStorage.getItem('table6_favorites')) || [];
    
    // 2. IMPORTANT: If the data is nested [[...]], flatten it immediately
    if (Array.isArray(favorites)) {
        favorites = favorites.flat();
    }

    // 3. Check for duplicates
    const exists = favorites.some(fav => fav.uri === recipe.uri);
    
    if (!exists) {
        favorites.push(recipe);
        // 4. Save as a clean, single-bracket array
        localStorage.setItem('table6_favorites', JSON.stringify(favorites));
        return true;
    }
    return false;
}

export function getFavorites() {
    const data = JSON.parse(localStorage.getItem('table6_favorites')) || [];
    // Always return a flat array so favorites.js can loop through it
    return Array.isArray(data) ? data.flat() : [];
}
