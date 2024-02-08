import type { Recipe } from '../model.ts';
import View from './View.ts';
import icon from '../../img/icons.svg';

class PreviewView extends View {
  protected _parentElement: HTMLElement | null = null;

  protected _generateMarkup(): string {
    const id = window.location.hash.slice(1);
    const data = this._data as Recipe;

    return `
    <li class="preview">
      <a class="preview__link ${
        data?.id === id ? 'preview__link--active' : ''
      }" href="#${data?.id}">
        <figure class="preview__fig">
          <img src="${data?.image_url}" alt="Test" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${data?.title}</h4>
          <p class="preview__publisher">${data?.publisher}</p> 
          <div class="recipe__user-generated ${data?.key ? '' : 'hidden'}">
            <svg>
              <use href="${icon}#icon-user"></use>
            </svg>
          </div>         
        </div>
      </a>
    </li>`;
  }
}

export default new PreviewView();
