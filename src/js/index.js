//API used: https://forkify-api.herokuapp.com/api/search?&q=${this.query}

//The controllers will be placed here
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {domElements, renderLoader, clearLoader} from './views/baseSelectors';

/*Global state of the app
1st - search object
2nd - current recipe object
3rd - shopping list object
4th - liked recipes
*/
const state = {};
//Search Controller
const controlSearch = async ()=> {
  // 1st - get query from view
  const query = searchView.getInput();
  if(query){
    //2nd - New searched obj and add to the global state
    state.search = new Search(query);

    // 3rd - prepare the UI for results
    searchView.clearInput();
    searchView.clearResultlist();
    renderLoader(domElements.searchResult);

    // 4th - Search for recipes
    await state.search.getResults();
   
    // 5th - render results in the UI
    clearLoader();
    searchView.renderResult(state.search.result);
    
  }
};

domElements.searchForm.addEventListener('submit', event=>{
  //cancel the default action to happen, in this case reloading the page
  event.preventDefault();
  controlSearch();
});

domElements.searchResultPages.addEventListener('click', event =>{
  const btn = event.target.closest('.btn-inline');
  if(btn){
    //reading the data-goto value, base 10
    const paginationNumber = parseInt(btn.dataset.goto, 10);
    searchView.clearResultlist();
    searchView.renderResult(state.search.result, paginationNumber);
  }
});

//recipe controller
const r = new Recipe(35107);
r.getRecipe();
console.log(r);
