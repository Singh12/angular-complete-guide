import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  getUpdetedIngerdients = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
   private ingredients: Ingredient[] = [
    new Ingredient('Apple', 1),
    new Ingredient('Tomatoes', 2)
  ];
  constructor() { }
  getIngredients() {
    return this.ingredients.slice();
  }
  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.getUpdetedIngerdients.next(this.ingredients);
  }
  // this is comming from recipe page
  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.getUpdetedIngerdients.next(this.ingredients);
  }
  getIngredient(index: number) {
    const ingredent = this.ingredients.slice();
    return ingredent[index];
  }
  updateIngredient(index: number, ingredient: Ingredient) {
    // this.ingredients.splice(index, 1 , ingredient);
    this.ingredients[index] = ingredient;
    this.getUpdetedIngerdients.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.getUpdetedIngerdients.next(this.ingredients.slice());
  }
}
