import { getRecipes } from '../js/api/recipeService.js';
import { recipeTemplate } from '../js/components/recipeCard.js';
import { saveRecipe } from '../js/utils/storage.js';
import { getNutritionDetails } from '../js/api/nutritionService.js';
import { nutritionTemplate } from '../js/components/nutritionModal.js';
import { calculateScaledAmount } from '../js/utils/scaler.js';

// Configuration & Cache
const nutritionCache = {};
const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
const recipeGrid = document.querySelector("#recipe-grid");
const backToTopBtn = document.querySelector("#back-to-top");
const modal = document.querySelector("#macro-modal");
const dataContainer = document.querySelector("#macro-data");

// --- SEARCH LOGIC ---
searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    const checkFilters = Array.from(document.querySelectorAll(".recipe-filter:checked")).map(input => input.value);

    if (query !== "" || checkFilters.length > 0) {
        recipeGrid.innerHTML = "<p>Searching for deliciousness...</p>";
        
        try {
            const recipes = await getRecipes(query, checkFilters);
            recipeGrid.innerHTML = "";

            if (!recipes || recipes.length === 0) {
                recipeGrid.innerHTML = `<p>No recipes found. Try something else!</p>`;
            } else {
                // Map results and inject the FULL recipe data into the card HTML
                recipeGrid.innerHTML = recipes.map(hit => {
                    const fullData = encodeURIComponent(JSON.stringify(hit.recipe));
                    const html = recipeTemplate(hit.recipe);
                    // This line "sneaks" the full data into the card so we can save it later
                    return html.replace('class="recipe-card', `data-full="${fullData}" class="recipe-card`);
                }).join('');
            }
        } catch (err) {
            recipeGrid.innerHTML = "<p>Something went wrong. Please try again.</p>";
        }
    } else {
        alert("Please enter an ingredient or select a dietary filter.");
    }
});

// --- GRID EVENT DELEGATION (Save favorites & nutrition) ---
recipeGrid.addEventListener("click", async (e) => {
    const card = e.target.closest(".recipe-card");
    if (!card) return;

    // SAVE RECIPE LOGIC
    if (e.target.classList.contains("save-btn")) {
        const recipeData = JSON.parse(decodeURIComponent(card.dataset.full));
        const success = saveRecipe(recipeData);
        alert(success ? "Recipe saved to favorites! ❤️" : "This recipe is already saved.");
    }

    // NUTRITION MODAL LOGIC
    if (e.target.classList.contains("nutrition-btn")) {
        const title = card.querySelector("h3").innerText;

        const currentServings = parseInt(card.querySelector(".servings-input").value || 1);
        const originalYield = parseInt(card.querySelector(".orig-yield").textContent || 1);

        // calculate ratio
        const ratio = currentServings / originalYield;

        modal.style.display = "flex";
        dataContainer.innerHTML = `<p>Analyzing macros...</p>`;

        if (nutritionCache[title]) {
            dataContainer.innerHTML = nutritionTemplate(nutritionCache[title], ratio);
            return;
        }

        // Get and clean ingredients for API
        const rawIngredients = JSON.parse(decodeURIComponent(card.dataset.ingredients || "[]"));
        const cleanIngredients = rawIngredients.map(ing => ing.replace(/\s*\(.*?\)\s*/g, ' ').trim());

        const data = await getNutritionDetails(title, cleanIngredients);
        if (data) {
            nutritionCache[title] = data;
            dataContainer.innerHTML = nutritionTemplate(data, ratio);
        } else {
            dataContainer.innerHTML = "<p>Nutrition data unavailable.</p>";
        }
    }
});

// --- GRID EVENT DELEGATION (Ingredient scaler) ---
recipeGrid.addEventListener("input", (e) => {
    if (e.target.classList.contains("servings-input")) {
        const input = e.target;
        const card = input.closest(".recipe-card");

        const targetServings = parseInt(input.value);
        const orginalYield = parseInt(card.querySelector(".orig-yield").textContent);

        const amountSpans = card.querySelectorAll(".amt");

        amountSpans.forEach(span => {
            const originalAmount = parseFloat(span.dataset.orig);

            const newAmount = calculateScaledAmount(originalAmount, orginalYield, targetServings);

            span.textContent = originalAmount ? newAmount : "";
        });
    }
});

// --- UI HELPERS (Modals & Scroll) ---
document.querySelector(".close-modal").addEventListener("click", () => modal.style.display = "none");
modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
