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
    const units = [...unitShort, 'g', 'kg'];
    const newIngredients = this.ingredients.map(current =>{
      // 1st - Uniform units
      let ingredients = current.toLowerCase();
      unitsLong.forEach((current, index) =>{
        ingredients = ingredients.replace(current, unitShort[index]);
      });

      // 2nd - Remove paranthesis
      ingredients = ingredients.replace(/ *\([^)]*\) */g, ' ');
      
      // 3rd - Parse ingredients into count, unit and ingredients
      const arrIng = ingredients.split(' ');
      const unitIndex = arrIng.findIndex(element2 => units.includes(element2));

      let objIng;
      if (unitIndex > -1){
        // there's an unit
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if(arrCount.length === 1){
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredients: arrIng.slice(unitIndex+1).join(' ')
        };
      } else if (parseInt(arrIng[0], 10) > -1){
        //there isn't an unit but there's a number in 1st position
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredients: arrIng.slice(1).join(' ')
        };
      } else if(unitIndex === -1){
        //there's no unit and no number at all
        objIng = {
          count: 1,
          unit: '',
          ingredients
        };
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }
}