// Imports {
import * as model from './model.ts';
import recipeView from './views/recipeView.ts';
import searchView from './views/searchView.ts';
import resultsView from './views/resultsView.ts';
import paginationView from './views/paginationView.ts';

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
    // 3) Load recipe by passing the id to fetch it (Model)
    await model.loadRecipe(id);
    // 4) Render recipe by passing the updated state (View)
    recipeView.render(model.state.recipe);
    // Test
    // controlServings();
  } catch (err) {
    recipeView.renderError();
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

  if (!model.state.recipe?.bookmarked) {
    model.addBookmark(recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  console.log(model.state.recipe);
};

// Initiating the app using publisher and subscriber pattern
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
