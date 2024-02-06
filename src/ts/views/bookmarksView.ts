import type { RecipeNew } from '../model.ts';
import View from './View.ts';
// import icon from '../../img/icons.svg';

class bookmarksView extends View {
  protected _parentElement = document.querySelector(
    '.bookmarks__list'
  ) as HTMLUListElement;
  protected _errorMessage =
    'No bookmarks yet. Find a nice recipe and bookmark it!';
  protected _message = '';

  protected _generateMarkupPreview(recipe: RecipeNew): string {
    const id = window.location.hash.slice(1);

    return `
    <li class="preview">
      <a class="preview__link ${
        recipe.id === id ? 'preview__link--active' : ''
      }" href="#${recipe.id}">
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
    console.log(this._data);
    return this._data
      ?.map(recipe => this._generateMarkupPreview(recipe))
      .join('');
  }
}

export default new bookmarksView();