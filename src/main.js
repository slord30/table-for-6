import { getRecipes } from './api/recipeService.js';
import { recipeTemplate } from './components/recipeCard.js';
import { saveRecipe } from './utils/storage.js';
import { getNutritionDetails } from './api/nutritionService.js';

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
        
        const rawIngredients = JSON.parse(decodeURIComponent(card.dataset.ingredients || "[]"));
        const ingredients = rawIngredients.map(ing => ing.replace(/\s*\(.*?\)\s*/g, ' ').trim());
        console.log("Sending ingredients:", ingredients)

        const modal = document.querySelector("#macro-modal");
        const dataContainer = document.querySelector("#macro-data");

        modal.style.display = "flex";
        dataContainer.innerHTML = `<p>Analyzing macros...</p>`;

        const data = await getNutritionDetails(title, ingredients);

        if (data && (data.calories !== undefined)) {
            const calories = data.calories || 0;
            const protein = data.totalNutrients.PROCNT?.quantity || 0;
            const fat = data.totalNutrients.FAT?.quantity || 0;
            const carbs = data.totalNutrients.CHOCDF?.quantity || 0;

            dataContainer.innerHTML = `
                <div class ="macro-grid">
                    <div class="macro-item"><strong>Calories:</strong> ${calories}</div>
                    <div class="macro-item"><strong>Protein:</strong> ${Math.round(protein)}g</div>
                    <div class="macro-item"><strong>Fat:</strong> ${Math.round(fat)}g</div>
                    <div class="macro-item"><strong>Carbs:</strong> ${Math.round(carbs)}g</div>
                </div>
            `;
        }   else {
            dataContainer.innerHTML = "<p>Sorry, nutrition data is unavailable for this recipe.</p>";
        }
    }
});

document.querySelector(".close-modal").addEventListener("click", () => {
    document.querySelector("#macro-modal").style.display = "none";
});

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