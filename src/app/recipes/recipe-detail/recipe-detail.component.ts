import { Component, OnInit, OnChanges } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.action';
import { map, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnChanges {
  recipe: Recipe;
  id: number;
  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // Using a observabel chain
    this.route.params.pipe(
      map(params => {
        return +params.id;
      }),
      switchMap((id: number) => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipeState => {
        return recipeState.recipes.find((recipe, index) => {
          return index === this.id;
        });
      })
    ).subscribe((recipe: Recipe) => {
      this.recipe = recipe;
    });


    // this.route.params.subscribe(
    //   (param: Params) => {
    //     this.id = +param.id;
    //     this.store.select('recipes').pipe(
    //       map(recipesState => {
    //         return recipesState.recipes.find((recipe, index) => {
    //             return index === this.id;
    //         });
    //       })
    //     ).subscribe((recipe: Recipe) => {
    //       this.recipe = recipe;
    //     });
    //     // this.recipe = this.recipeService.fetchRecipe(this.id);
    //   });
  }

  onAddToShoppingList() {
    this.recipeService.addSoppingListRecipe(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDelete() {
    // this.recipeService.onDeleteRecipe(this.id);
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['recipe']);
  }

  ngOnChanges() {
  }

}
