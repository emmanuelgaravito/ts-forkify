import icon from '../../img/icons.svg';
import type { Recipe, RecipeNew, SearchResults } from '../model.ts';

export default abstract class View {
  protected _data: Recipe | RecipeNew[] | SearchResults | null = null;
  protected _parentElement: HTMLElement | null = null;
  protected _errorMessage: string = '';
  protected _message: string = '';

  public render(data: Recipe | RecipeNew[] | SearchResults | null): void {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    if (!markup) return;
    this._parentElement?.insertAdjacentHTML('afterbegin', markup);
  }

  public update(data: Recipe | RecipeNew[] | SearchResults | null): void {
    this._data = data;
    const newMarkup = this._generateMarkup();
    if (!newMarkup) return;
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(
      this._parentElement?.querySelectorAll('*') as NodeListOf<HTMLElement>
    );

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue?.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      // Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  protected abstract _generateMarkup(): string | undefined;

  protected _clear(): void {
    if (this._parentElement) this._parentElement.innerHTML = '';
  }

  public renderSpinner(): void {
    const markup: string = `
      <div class="spinner">
        <svg>
          <use href="${icon}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement?.insertAdjacentHTML('afterbegin', markup);
  }
  // message: string = this._errorMessage
  public renderError(): void {
    const markup: string = `
    <div class="error">
    <div>
      <svg>
        <use href="${icon}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${this._errorMessage}</p>
  </div>`;

    this._clear();
    this._parentElement?.insertAdjacentHTML('afterbegin', markup);
  }
  public renderMessage(message: string = this._message): void {
    const markup: string = `
    <div class="message">
    <div>
      <svg>
        <use href="${icon}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;

    this._clear();
    this._parentElement?.insertAdjacentHTML('afterbegin', markup);
  }
}
