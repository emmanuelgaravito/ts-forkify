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
  id: string;
  title: string;
  publisher: string;
  source_url: string;
  image_url: string;
  servings: number;
  cooking_time: number;
  ingredients: Ingredient[];
  bookmarked?: boolean;
  key?: string;
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
  key?: string;
}

import { API_URL, RES_PER_PAGE } from './config.ts';
import { getJSON } from './helpers.ts';
import { sendJSON } from './helpers.ts';
import { KEY } from './config.ts';

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

const createRecipeObject = function (data: DataMain): Recipe {
  const recipe = data.data.recipe;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    source_url: recipe.source_url,
    image_url: recipe.image_url,
    servings: recipe.servings,
    cooking_time: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

// Api Fetch for individual recipe based on id
export const loadRecipe = async function (id: string): Promise<void> {
  try {
    const data = await getJSON<DataMain>(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 💥💥`);
    throw err;
  }
};

// Api Fetch for search All the recipes that matches the query
export const loadSearchResults = async function (query: string) {
  try {
    state.search.query = query;

    const data = await getJSON<Root>(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image_url: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // Reset pagination to page 1 every time we search
    state.search.page = 1;
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

const persistBookmarks = function (): void {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe: Recipe): void {
  // Add bookmark
  state.bookmarks.push(recipe);
  // Mark current recipe as bookmark
  if (recipe.id === state.recipe?.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id: string): void {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // Mark current recipe as NOT bookmark
  if (id === state.recipe?.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function (): void {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function (): void {
  localStorage.clear();
};

// clearBookmarks();
type RecipeData = {
  title: string;
  sourceUrl: string;
  image: string;
  publisher: string;
  cookingTime: string;
  servings: string;
  [key: string]: string; // for ingredient properties
};

export const uploadRecipe = async function (
  newRecipe: RecipeData
): Promise<void> {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format.'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data: DataMain = await sendJSON(
      `${API_URL}?key=${KEY}`,
      recipe as unknown as RecipeData
    );

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

export type { Recipe, RecipeNew, DataNew, SearchResults, RecipeData };
