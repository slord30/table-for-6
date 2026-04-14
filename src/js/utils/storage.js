export function saveRecipe(recipe) {
  let favorites = JSON.parse(localStorage.getItem("table6_favorites")) || [];

  if (Array.isArray(favorites)) {
    favorites = favorites.flat();
  }

  const exists = favorites.some((fav) => fav.uri === recipe.uri);

  if (!exists) {
    favorites.push(recipe);
    localStorage.setItem("table6_favorites", JSON.stringify(favorites));
    return true;
  }
  return false;
}

export function getFavorites() {
  const data = JSON.parse(localStorage.getItem("table6_favorites")) || [];
  return Array.isArray(data) ? data.flat() : [];
}
