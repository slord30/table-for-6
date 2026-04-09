import { recipeTemplate } from './components/recipeCard.js';

const favoritesGrid = document.querySelector("#favorites-grid");

function loadFavorites() {
    const savedRecipes = JSON.parse(localStorage.getItem('saved-recipes')) || [];

    if (savedRecipes.length === 0) {
        favoritesGrid.innerHTML = "<p>No favorites saved yet. Go find some deliciousness!</p>";
        return;
    }

    const htmlString = savedRecipes.map(recipe => recipeTemplate(recipe)).join('');
    favoritesGrid.innerHTML = htmlString;
}

loadFavorites();
