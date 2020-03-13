import {domElements} from './baseSelectors'

export const getInput = () => domElements.searchInput.value;

export const clearInput = () => {
  domElements.searchInput.value = '';
};

export const clearResultlist = () => {
  domElements.searchResultsList.innerHTML = '';
  domElements.searchResultPages.innerHTML = '';
};

export const highlightSelected = id =>{
  const resultArray = Array.from(document.querySelectorAll('.results__link'));
  resultArray.forEach(current => {
    current.classList.remove('results__link--active');
  });
  document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

const limitRecipeTitle = (recipeTitle, charLimit = 18) =>{
  const newTitle = [];
  if(recipeTitle.length >= charLimit){
    recipeTitle.split(' ').reduce((accumulator, current) => {
      if(accumulator + current.length <= charLimit){
        newTitle.push(current);
      }
      return accumulator + current.length;
    }, 0);
    return `${newTitle.join(' ')} ...`;
  }
  return recipeTitle;
};

const renderRecipe = recipe => {
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">${recipe.publisher}</p>
        </div>
      </a>
    </li>
  `;
  domElements.searchResultsList.insertAdjacentHTML('beforeend', markup);
};

const createBtn = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
    
  </button>
`;

const renderPagesButton = (resultsNumber, resultsPerPage, currentPage) => {
  const totalPages = Math.ceil((resultsNumber / resultsPerPage));
  let button;
  if( currentPage === 1 && totalPages > 1){
    // Only one button next page 2
    button = createBtn(currentPage, 'next');
  } else if(currentPage < totalPages){
    //Both buttons
    button = `
      ${createBtn(currentPage, 'prev')}  
      ${createBtn(currentPage, 'next')}  
    `;
  } else if(currentPage === totalPages && currentPage > 1){
    // only one button previous page
    button = createBtn(currentPage, 'prev');
  }

  domElements.searchResultPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResult = (recipe, page = 1, resultsPerPage = 10) =>{
  //rendering the results of the current page
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;
  recipe.slice(start, end).forEach(renderRecipe);

  //render the pagination buttons
  renderPagesButton(recipe.length, resultsPerPage, page);
};