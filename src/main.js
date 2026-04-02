import { getRecipes } from './api/recipeService.js';
import { recipeTemplate } from './components/recipeCard.js';
import { saveRecipe } from './utils/storage.js';
import { getNutritionDetails } from './api/nutritionService.js';
import { nutritionTemplate } from './components/nutritionModal.js';


const nutritionCache = {};

const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
const recipeGrid = document.querySelector("#recipe-grid");
const backToTopBtn = document.querySelector("#back-to-top");

// 1. Search Functionality
searchBtn.addEventListener("click", async () => {
    const query = searchInput.value;
    if (query) {
        recipeGrid.innerHTML = "<p>Searching for deliciousness...</p>";
        const recipes = await getRecipes(query);

        // Clear old results
        recipeGrid.innerHTML = "";

        if (recipes.length === 0) {
            recipeGrid.innerHTML = `<p>No recipes found for "${query}". Try something else!</p>`;
        } else {
            // Render new cards
            const htmlString = recipes.map(hit => recipeTemplate(hit.recipe)).join('');
            recipeGrid.innerHTML = htmlString;
        }
    }
});

// scaling recipe
recipeGrid.addEventListener("input", (e) => {
    if (e.target.classList.contains("servings-input")) {
        const card = e.target.closest(".recipe-card");
        const targetServings = parseFloat(e.target.value) || 1; // Default to 1 if empty
        const originalYield = parseFloat(card.querySelector(".orig-yield").innerText);

        const amounts = card.querySelectorAll(".amt");

        amounts.forEach(span => {
            const originalAmount = parseFloat(span.dataset.orig);
            if (!isNaN(originalAmount)) {
                const multiplier = targetServings / originalYield;
                const newAmount = Math.round((originalAmount * multiplier) * 100) / 100;
                span.innerText = newAmount;
            }
        });
    }
});

recipeGrid.addEventListener("click", async (e) => {
    //save recipe
    if (e.target.classList.contains("save-btn")) {
        const card = e.target.closest(".recipe-card");

        const recipeToSave = {
            label: card.querySelector("h3").innerText,
            image: card.querySelector("img").src,
            uri: card.dataset.id
        };

        const success = saveRecipe(recipeToSave);
        if (success) {
            alert("Recipe saved to your favorites!");
        } else {
            alert("This recipe is already in your favorites.");
        }
    }

    // nutrition modal
     if (e.target.classList.contains("nutrition-btn")) {
        const card = e.target.closest(".recipe-card");
        const title = card.querySelector("h3").innerText;

        const modal = document.querySelector("#macro-modal");
        const dataContainer = document.querySelector("#macro-data");

        if (nutritionCache[title]) {
            console.log("Using cached data for:", title);
            modal.style.display = "flex";
            dataContainer.innerHTML = nutritionTemplate(nutritionCache[title]);
            return;
        }
        
        // Clean ingredients for better API mapping
        const rawIngredients = JSON.parse(decodeURIComponent(card.dataset.ingredients || "[]"));
        const ingredients = rawIngredients.map(ing => ing.replace(/\s*\(.*?\)\s*/g, ' ').trim());

        // Show modal and loading state
        modal.style.display = "flex";
        dataContainer.innerHTML = `<p>Analyzing macros...</p>`;

        // Fetch and Render via nutritionModal.js
        const data = await getNutritionDetails(title, ingredients);

        if (data) nutritionCache[title] = data;

        dataContainer.innerHTML = nutritionTemplate(data);
    }
});


// Modal and UI Helpers
document.querySelector(".close-modal").addEventListener("click", () => {
    document.querySelector("#macro-modal").style.display = "none";
});

const modal = document.querySelector("#macro-modal");

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
})

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});