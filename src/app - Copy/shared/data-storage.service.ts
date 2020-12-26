import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import {exhaustMap, map, take, tap} from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  storeRecipe() {
    const recipe = this.recipeService.getRecipe();
    this.http.put('https://recipe-13858.firebaseio.com/recipe.json', recipe)
      .subscribe(data => {
        console.log(data);
      });
  }

  fetchRecipe() {
   return this.http.get<Recipe[]>('https://recipe-13858.firebaseio.com/recipe.json')
    .pipe(map(recipes => {
      return recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      });
    }), tap(recipe => {
       this.recipeService.setRecipe(recipe);
    }));
  }
}
