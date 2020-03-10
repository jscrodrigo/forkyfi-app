import axios from 'axios';
export default class Recipe {
  constructor(id){
    this.id = id;
  }

  async getRecipe(){
    try{
      const result = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      this.title = result.data.recipe.title;
      this.publisher = result.data.recipe.publisher;
      this.image = result.data.recipe.image_url;
      this.url = result.data.recipe.source_url;
      this.ingredients = result.data.recipe.ingredients;

    } catch(error){
        alert(`Ops... could not get the recipe!\n ${error})`);
    }
  }

  calculateTime(){
    const numberOfIngredients = this.ingredients.length;
    const periods = Math.ceil((numberOfIngredients / 3));
    this.cookingTime = periods * 15;
  }

  calculateServings(){
    this.servings = 4; 
  }
}