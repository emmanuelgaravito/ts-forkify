// Imports {
import * as model from './model.ts';
import recipeView from './views/recipeView.ts';
import searchView from './views/searchView.ts';
import resultsView from './views/resultsView.ts';
import paginationView from './views/paginationView.ts';
import bookmarksView from './views/bookmarksView.ts';
import addRecipeView from './views/addRecipeView.ts';
import { MODAL_CLOSE_SEC } from './config.ts';
import type { RecipeData } from './model.ts';

// }

///////////////////////////////////////

// Controlling the recipe by getting the id from the url
const controlRecipes = async function (): Promise<void> {
  try {
    //! IMPORTANT  learn that this is the location of the hash in the browser
    const id: string = window.location.hash.slice(1);
    if (!id) return; // Guard clause
    // 1) Loading spinner(View)
    recipeView.renderSpinner();
    // 2) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // 3) Update bookmarks view
    bookmarksView.update(model.state.bookmarks);
    // 3) Load recipe by passing the id to fetch it (Model)
    await model.loadRecipe(id);
    // 4) Render recipe by passing the updated state (View)
    recipeView.render(model.state.recipe);
    // Test

    // controlServings();
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function (): Promise<void> {
  try {
    // 1) Get query from view -->
    const query = searchView.getQuery();
    if (!query) return; // guard clause
    // 2) Load spinner (View)-->
    resultsView.renderSpinner();
    // 2) Load search results by passing the query to fetch it (Model)<--
    await model.loadSearchResults(query);
    // 3) Render results by passing getSearchResultsPage() function (View) -->
    resultsView.render(model.getSearchResultsPage());
    // 4) Render pagination (View) -->
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage: number | undefined): void {
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2) Render new pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings: number): void {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function (): void {
  const recipe = model.state.recipe;

  if (recipe === null) return;
  // Add or remove bookmark
  if (!model.state.recipe?.bookmarked) {
    model.addBookmark(recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  // Update recipe view
  recipeView.update(model.state.recipe);
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function (): void {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe: RecipeData): Promise<void> {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();
    //upload new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //render recipe
    recipeView.render(model.state.recipe);
    //Success message
    addRecipeView.renderMessage();
    // render bookmark View
    bookmarksView.render(model.state.bookmarks);
    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe?.id}`);

    // close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError((err as Error).message);
  }
  //upload the new recipe data
};

// Initiating the app using publisher and subscriber pattern
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

console.log(addRecipeView);
