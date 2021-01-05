import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list-actions';
import * as formShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromApp from '../store/app.reducer';
@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();
  // recipes: Recipe[] = [
  //   new Recipe('Chicken', 'Chicken is very testy', 'https://www.indianhealthyrecipes.com/wp-content/uploads/2018/07/chilli-chicken-recipe-500x500.jpg', [new Ingredient('chicken', 8), new Ingredient('Onion', 8)]),
  //   new Recipe('Chicken1', 'Chicken is very testy1', 'https://www.indianhealthyrecipes.com/wp-content/uploads/2018/07/chilli-chicken-recipe-500x500.jpg', [new Ingredient('potatto', 88)])
  // ];
  recipes: Recipe[] = [];
  constructor(
    private shoppList: ShoppingListService,
    private store: Store<fromApp.AppState>) { }

  getRecipe() {
    return this.recipes.slice();
  }

  addSoppingListRecipe(shoppingList: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(shoppingList));
    // this.shoppList.addIngredients(shoppingList);
  }

  fetchRecipe(index: number) {
    return this.recipes[index];
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  addNewRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }
  onDeleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }

  setRecipe(recipe: Recipe[]) {
    this.recipes = recipe;
    this.recipeChanged.next(this.recipes.slice());
  }
}
