//API used: https://forkify-api.herokuapp.com/api/search?&q=${this.query}

//The controllers will be placed here
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/shoppingListView';
import * as likesView from './views/likesView';
import {domElements, renderLoader, clearLoader} from './views/baseSelectors';

/*Global state of the app
1st - search object
2nd - current recipe object
3rd - shopping list object
4th - liked recipes
*/
const state = {};;
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

/*Recipe controller*/
const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');
  if(id){
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(domElements.recipeResult);
    if(state.search){
      searchView.highlightSelected(id);
    }
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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

    } catch(error){
      alert(`Could not find a recipe.\n ${error}`);
    }
    
  }
};

['hashchange', 'load'].forEach(current => window.addEventListener(current, controlRecipe));

/*List Controller */
const controlList = () =>{
  // Create a new list (if there's none yet)
  if(!state.list){
    state.list = new List();
  }

  //Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(current =>{
   const item = state.list.addItem(current.count, current.unit, current.ingredients);
   listView.renderItem(item);
  });
};

//Handle, delete and update list item's events
domElements.shoppingList.addEventListener('click', event =>{
  const id = event.target.closest('.shopping__item').dataset.itemid;

  //Handle the delete button
  if(event.target.matches('.shopping__delete, .shopping__delete *')){
    // Delete from the state
    state.list.deleteItem(id);

    // delete from the UI
    listView.deleteItem(id);

    //Handle the count update
  } else if(event.target.matches('.shoppig__count-value')) {
    const val = parseFloat(event.target.value);
    if(val >=0){
      state.list.updateCount(id, val);
    } else{
      state.list.updateCount(id, 'invalid value');
    }
  }
});

/*Likes Controller */
const controlLikes = () => {
  if(!state.likes) state.likes = new Likes();
  //The recipe has not been liked before
  if(!state.likes.isLiked(state.recipe.id)) {
    //Add the like to the state
    const newLike = state.likes.addLikes(state.recipe.id, 
      state.recipe.title, 
      state.recipe.publisher, 
      state.recipe.image);

      //Toggle the like button
      likesView.toggleLikeButton(true);
      //Show on UI
      likesView.renderLikesList(newLike);
           
  //The recipe has been liked already
  } else {
    //Remove the like
    state.likes.deleteLike(state.recipe.id);

    //Toggle the button
    likesView.toggleLikeButton(false);
    //Remove like from the UI
    likesView.deleteLike(state.recipe.id);
  }
    likesView.toggleLikesMenu(state.likes.getNumberOfLikes());
};

//Restore liked recipes
window.addEventListener('load', () => {
  state.likes = new Likes();

  //Restore likes
  state.likes.readData();

  //Toggle the button
  likesView.toggleLikesMenu(state.likes.getNumberOfLikes());

  //Render the existing likes
  state.likes.likes.forEach(like => likesView.renderLikesList(like));
});

//Handling recipes button clicks
domElements.recipeResult.addEventListener('click', event =>{
  if(event.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button was clicked
    if(state.recipe.servings > 1){
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if(event.target.matches('.btn-increase, .btn-increase *')) {
    //Increase button was clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if(event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if(event.target.matches('.recipe__love, .recipe__love *')) {
    controlLikes();
  }
});
