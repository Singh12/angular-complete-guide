import { Actions, Effect, ofType } from '@ngrx/effects';
import * as RecipeActions from '../store/recipe.action';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
@Injectable()
export class RecipeEffets {
   @Effect()
   fetchRecipe = this.actions$.pipe(
       ofType(RecipeActions.FETCH_RECIPE),
       switchMap(() => {
          return this.http.get<Recipe[]>('https://recipe-13858.firebaseio.com/recipe.json');
       }),
       map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      map(recipes => {
          return new RecipeActions.SetRecipe(recipes);
      })
   );
  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(RecipeActions.STORE_RECIPE),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put('https://recipe-13858.firebaseio.com/recipe.json', recipesState.recipes);
    })
  );
    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}
}
