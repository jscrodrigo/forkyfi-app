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
      console.log(result.data.recipe);
    } catch(error){
      alert(error);
    }
  }

  calcTime(){
    const numberOfIngredients = this.ingredients.lenght;
    const periods = Math.ceil((this.numberOfIngredients / 3));
    this.cookingTime = this.periods * 15;
  }
}