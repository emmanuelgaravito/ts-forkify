import type { RecipeNew } from '../model.ts';
import View from './View.ts';
// import icon from '../../img/icons.svg';

class resultsView extends View {
  protected _parentElement = document.querySelector(
    '.results'
  ) as HTMLUListElement;
  protected _errorMessage =
    'No recipes found for your query. Please try again!';
  protected _message = '';

  protected _generateMarkupPreview(recipe: RecipeNew): string {
    return `
    <li class="preview">
      <a class="preview__link " href="#${recipe.id}">
        <figure class="preview__fig">
          <img src="${recipe.image_url}" alt="Test" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${recipe.title}</h4>
          <p class="preview__publisher">${recipe.publisher}</p>          
        </div>
      </a>
    </li>`;
  }
  protected _generateMarkup(): string {
    if (!Array.isArray(this._data)) return '';
    return this._data
      ?.map(recipe => this._generateMarkupPreview(recipe))
      .join('');
  }
}

export default new resultsView();
