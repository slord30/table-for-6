import { recipeTemplate } from './components/recipeCard.js';
import { getFavorites } from './utils/storage.js';

const favoritesGrid = document.querySelector("#recipe-grid");

function loadFavorites() {
    const savedRecipes = getFavorites();

    if (savedRecipes.length === 0) {
        favoritesGrid.innerHTML = "<p>No favorites saved yet. Go find some deliciousness!</p>";
        return;
    }

    const htmlString = savedRecipes.map(recipe => recipeTemplate(recipe)).join('');
    favoritesGrid.innerHTML = htmlString;
}

loadFavorites();
