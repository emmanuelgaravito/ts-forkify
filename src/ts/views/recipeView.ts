import View from './View.ts';
import icon from '../../img/icons.svg';
import fracty from 'fracty';
import { Recipe } from '../model.ts';

export class RecipeView extends View {
  protected _parentElement = document.querySelector(
    '.recipe'
  ) as HTMLDivElement;
  protected _errorMessage =
    'We could not find that recipe. Please try another one!';
  protected _message = '';

  public addHandlerRender(handler: () => Promise<void>): void {
    ['hashchange', 'load'].forEach((ev: string) =>
      window.addEventListener(ev, handler)
    );
  }

  protected _ingredientsMarkup(): string | undefined {
    const data = this._data as Recipe;
    if (Array.isArray(this._data)) return;
    if (!('ingredients' in data)) return '';

    return data.ingredients
      .map(ingredient => {
        return `
        <li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${icon}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${
              ingredient.quantity ? fracty(ingredient.quantity) : ''
            }</div>
            <div class="recipe__description">
              <span class="recipe__unit">${ingredient.unit}</span>
              ${ingredient.description}
            </div>
          </li>`;
      })
      .join('');
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      console.log(btn);
      const updateTo = +btn.dataset.updateTo;
      console.log(updateTo);
      handler(updateTo);
    });
  }

  protected _generateMarkup(): string {
    const data = this._data as Recipe;
    if (Array.isArray(data)) return '';
    if (!('publisher' in data)) return '';

    return `
    <figure class="recipe__fig">
          <img src="${data?.image_url}" alt="${
      data?.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${data?.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icon}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              data?.cooking_time
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icon}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              data?.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                data?.servings - 1
              }">
                <svg>
                  <use href="${icon}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                data?.servings + 1
              }">
                <svg>
                  <use href="${icon}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icon}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._ingredientsMarkup()}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              data?.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${data?.source_url}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }
}

export default new RecipeView();
