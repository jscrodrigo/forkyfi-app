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

  parseIngredients(){
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

    const newIngredients = this.ingredients.map(current =>{
      // 1st - Uniform units
      let ingredients = current.toLowerCase();
      unitsLong.forEach((current, index) =>{
        ingredients = ingredients.replace(current, unitShort[index]);
      });
      // 2nd - Remove paranthesis
      ingredients = ingredients.replace(/ *\([^)]*\) */g, ' ');
      
      // 3rd - Parse ingredients into count, unit and ingredients
      return ingredients;

    });
    this.ingredients = newIngredients;
  }
}