import type { Recipe } from '../model.ts';
import View from './View.ts';
import previewView from './previewView.ts';

class resultsView extends View {
  protected _parentElement = document.querySelector(
    '.results'
  ) as HTMLUListElement;
  protected _errorMessage =
    'No recipes found for your query. Please try again!';
  protected _message = '';

  protected _generateMarkup(): string {
    if (!Array.isArray(this._data)) return '';
    console.log(this._data);
    return this._data
      ?.map(bookmark => previewView.render(bookmark as Recipe, false))
      .join('');
  }
}

export default new resultsView();
