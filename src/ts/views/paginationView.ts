import View from './View.ts';
import icon from '../../img/icons.svg';
import { SearchResults } from '../model.ts';

class PaginationView extends View {
  protected _parentElement = document.querySelector(
    '.pagination'
  ) as HTMLUListElement;

  public addHandlerClick(handler: (goToPage: number) => void) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = (e.target as HTMLElement)?.closest(
        '.btn--inline'
      ) as HTMLElement;
      console.log(btn);
      if (!btn) return;
      const goToPage = btn.dataset.goto ? +btn.dataset.goto : undefined;
      if (typeof goToPage === 'number') {
        handler(goToPage);
      }
    });
  }

  protected _generateMarkup(): string | undefined {
    const data = this._data as SearchResults;
    const curPage = data?.page;
    const numPages: number = Math.ceil(
      data?.results.length / data?.resultsPerPage
    );
    console.log(numPages);
    const leftBtn: string = `
    <button data-goto= "${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icon}#icon-arrow-left"></use>
    </svg>
    <span>Page ${curPage - 1}</span>
    </button>`;
    const rightBtn: string = `
    <button data-goto= "${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${curPage + 1}</span>
    <svg class="search__icon">
      <use href="${icon}#icon-arrow-right"></use>
    </svg>
    </button>`;

    // page  1 and there ar other pages
    if (curPage === 1 && numPages > 1) return rightBtn;
    //last page
    if (curPage === numPages && numPages > 1) return leftBtn;
    // middle pages
    if (curPage < numPages) return leftBtn + rightBtn;
    //only one page
    if (curPage === numPages && numPages === 1) return '';
  }
}

export default new PaginationView();
