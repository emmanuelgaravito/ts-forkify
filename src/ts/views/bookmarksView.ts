import type { Recipe } from '../model.ts';
import View from './View.ts';
import previewView from './previewView.ts';

class bookmarksView extends View {
  protected _parentElement = document.querySelector(
    '.bookmarks__list'
  ) as HTMLUListElement;
  protected _errorMessage =
    'No bookmarks yet. Find a nice recipe and bookmark it!';
  protected _message = '';

  protected _generateMarkup(): string {
    if (!Array.isArray(this._data)) return '';
    console.log(this._data);
    return this._data
      ?.map(bookmark => previewView.render(bookmark as Recipe, false))
      .join('');
  }
}

export default new bookmarksView();
