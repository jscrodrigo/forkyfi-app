export const domElements = {
  searchInput: document.querySelector('.search__field'),
  searchForm: document.querySelector('.search'),
  searchResult: document.querySelector('.results'),
  searchResultsList: document.querySelector('.results__list'),
  searchResultPages: document.querySelector('.results__pages'),
  recipeResult: document.querySelector('.recipe'),
  shoppingList: document.querySelector('.shopping__list')
};

export const domElementStrings = {
  loader: 'loader'
};

export const renderLoader = parentElement => {
  const loader = `
    <div class="${domElementStrings.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
    `;
  parentElement.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () =>{
  const loader = document.querySelector(`.${domElementStrings.loader}`);
  if(loader){
    loader.parentElement.removeChild(loader);
  }
};