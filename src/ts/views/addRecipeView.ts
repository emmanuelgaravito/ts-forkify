import View from './View.ts';
// import icon from '../../img/icons.svg';
import type { RecipeData } from '../model.ts';

class AddRecipeView extends View {
  protected _parentElement = document.querySelector(
    '.upload'
  ) as HTMLFormElement;

  protected _window = document.querySelector(
    '.add-recipe-window'
  ) as HTMLDivElement;
  protected _overlay = document.querySelector('.overlay') as HTMLDivElement;

  protected _btnOpen = document.querySelector(
    '.nav__btn--add-recipe'
  ) as HTMLButtonElement;

  protected _btnClose = document.querySelector(
    '.btn--close-modal'
  ) as HTMLButtonElement;

  public _message: string = 'Your recipe was successfully uploaded 🎉';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  public toggleWindow(): void {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  protected _addHandlerShowWindow(): void {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  protected _addHandlerHideWindow(): void {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  public addHandlerUpload(handler: (data: RecipeData) => void): void {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr: [string, string][] = Array.from(new FormData(this) as any); // This is an array of all the values in the form
      const data = Object.fromEntries(dataArr) as RecipeData;
      console.log(data); // Convert array to object
      handler(data); // Pass data to handler function
    });
  }

  protected _generateMarkup(): any {}
}

export default new AddRecipeView();
