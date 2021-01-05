import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipe.action';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('recipes').pipe(
      take(1),
      map(recipeState => recipeState.recipes),
      switchMap((recipe: Recipe[]) => {
        if (recipe.length === 0 ) {
          this.store.dispatch(new RecipeActions.FetchRecipe());
          return this.actions$.pipe(ofType(RecipeActions.SET_RECIPE), take(1));
        } else {
          return of(recipe);
        }
      })
    );
    // const recipe = this.recipeService.getRecipe();
    // if (recipe.length === 0) {
    //   return this.dataStorage.fetchRecipe();
    // } else {
    //   return recipe;
    // }
  }
}
