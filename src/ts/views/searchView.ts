class SearchView {
  _parentElement = document.querySelector('.search') as HTMLFormElement;
  query = '';

  public getQuery(): string {
    const query = (
      this._parentElement.querySelector('.search__field') as HTMLInputElement
    ).value;

    this._clearInput();

    return query;
  }

  public addHandlerSearch(handler: () => Promise<void>) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
  protected _clearInput(): void {
    (
      this._parentElement.querySelector('.search__field') as HTMLInputElement
    ).value = '';
  }
}

export default new SearchView();
