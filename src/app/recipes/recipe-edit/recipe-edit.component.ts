import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import * as RecipeAction from '../store/recipe.action';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeFrom: FormGroup;
  storeSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSub = this.store.select('recipes').pipe(
        map(recipeState => {
          return recipeState.recipes.find((recipe, index) => {
            return index === this.id;
          });
        })
      ).subscribe(
        recipe => {
          // const recipe = this.recipeService.fetchRecipe(this.id);
          recipeName = recipe.name;
          recipeImagePath = recipe.imagepath;
          recipeDescription = recipe.description;
          if (recipe.ingredients) {
            for (const ingredient of recipe.ingredients) {
              recipeIngredients.push(new FormGroup({
                name: new FormControl(ingredient.name, Validators.required),
                amount: new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^\+?[1-9]\d{0,2}$/)])
              }));
            }
          }
        }
      );

    }
    this.recipeFrom = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagepath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }

  get ingredientControl() {
    console.log((this.recipeFrom.get('ingredients') as FormArray));
    return (this.recipeFrom.get('ingredients') as FormArray).controls;
  }

  onSubmit() {
    // const name = this.recipeFrom.value.name;
    // const imagepath = this.recipeFrom.value.imagePath;
    // const description = this.recipeFrom.value.description;
    // const ingredients = this.recipeFrom.value.ingredients;
    // const upadtedRecipe = {name, description, imagepath, ingredients};
    if (this.editMode) {
      this.store.dispatch(new RecipeAction.UpdateRecipe({index: this.id, recipe: this.recipeFrom.value}));
      // this.recipeService.updateRecipe(this.id, this.recipeFrom.value);
    } else {
      this.store.dispatch(new RecipeAction.AddRecipe(this.recipeFrom.value));
      // this.recipeService.addNewRecipe(this.recipeFrom.value);
    }
    this.onCancel();
  }

  deleteIngredient(index: number) {
    (this.recipeFrom.get('ingredients') as FormArray).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onAddIngredient() {
    (this.recipeFrom.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^\+?[1-9]\d{0,2}$/)])
      })
    );
  }

  ngOnDestroy() {
    if(this.editMode) {
      this.storeSub.unsubscribe();
    }
  }
}
