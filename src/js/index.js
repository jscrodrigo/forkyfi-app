//API used: https://forkify-api.herokuapp.com/api/search?&q=${this.query}

//The controllers will be placed here
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
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
    try {
      await state.search.getResults();
      // 5th - render results in the UI
      clearLoader();
      searchView.renderResult(state.search.result);
    } catch(error){
      alert(`Ops... something went wrong with the search :(\n ${error})`);
      clearLoader();
    }
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

//Recipe controller
const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');
  console.log(id);
  if(id){
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(domElements.recipeResult);
    searchView.highlightSelected(id);
    //Create a new recipe obj
    state.recipe = new Recipe(id);
    
    //Get recipe data and parse the ingredients
    try{
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      //Calc servings and time
      state.recipe.calculateTime();
      state.recipe.calculateServings();

      //Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch(error){
      alert(`Could not find a recipe.\n ${error}`);
    }
    
  }
}
['hashchange', 'load'].forEach(current => window.addEventListener(current, controlRecipe));