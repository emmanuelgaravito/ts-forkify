interface State {
  recipe: Recipe | null;
  search: SearchResults;
  bookmarks: Recipe[];
}

interface SearchResults {
  query: string;
  results: RecipeNew[];
  resultsPerPage: number;
  page: number;
}
// First Interface for getJSON
interface DataMain {
  status: string;
  data: Data;
}
interface Data {
  recipe: Recipe;
}
interface Recipe {
  id: number;
  title: string;
  publisher: string;
  source_url: string;
  image_url: string;
  servings: number;
  cooking_time: number;
  ingredients: Ingredient[];
  bookmarked?: boolean;
}

interface Ingredient {
  quantity: number;
  unit: string;
  description: string;
}
// Second Interface for getJSON
interface Root {
  status: string;
  results: number;
  data: DataNew;
}

interface DataNew {
  recipes: RecipeNew[];
}

interface RecipeNew {
  publisher: string;
  image_url: string;
  title: string;
  id: string;
}

import { API_URL, RES_PER_PAGE } from './config.ts';
import { getJSON } from './helpers.ts';

// State that we pass to All the functions in the View
export const state: State = {
  recipe: null,
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

// Api Fetch for individual recipe based on id
export const loadRecipe = async function (id: string): Promise<void> {
  try {
    const data = await getJSON<DataMain>(`${API_URL}${id}`);
    const recipe = data.data.recipe;

    const newRecipe: Recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      source_url: recipe.source_url,
      image_url: recipe.image_url,
      servings: recipe.servings,
      cooking_time: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    state.recipe = newRecipe;

    if (state.bookmarks.some(bookmark => bookmark.id === newRecipe.id))
      newRecipe.bookmarked = true;
    else newRecipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 💥💥`);
    throw err;
  }
};
// Api Fetch for search All the recipes that matches the query
export const loadSearchResults = async function (query: string) {
  try {
    state.search.query = query;

    const data = await getJSON<Root>(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image_url: rec.image_url,
      };
    });
  } catch (err) {
    console.error(`${err} 💥💥`);
    throw err;
  }
};

// Pagination function, helps to navigate between pages
export const getSearchResultsPage = function (
  page: number = state.search.page
): RecipeNew[] {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;
  return state.search.results.slice(start, end);
};

// Update servings
export const updateServings = function (newServings: number): void {
  if (!state.recipe || !state.recipe.servings) return; // Guard clause

  state.recipe?.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe?.servings!;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe: Recipe): void {
  // Add bookmark
  state.bookmarks.push(recipe);
  // Mark current recipe as bookmark
  if (recipe.id === state.recipe?.id) state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id: number): void {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // Mark current recipe as NOT bookmark
  if (id === state.recipe?.id) state.recipe.bookmarked = false;
};

export type { Recipe, RecipeNew, DataNew, SearchResults };
