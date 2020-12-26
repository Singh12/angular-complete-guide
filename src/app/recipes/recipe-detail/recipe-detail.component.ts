import { Component, OnInit, OnChanges } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit , OnChanges {
  recipe: Recipe;
  id: number;
  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(
      (param: Params) => {
        this.id = +param.id;
        this.recipe = this.recipeService.fetchRecipe(this.id);
        console.log(this.recipe);
      });
  }

  onAddToShoppingList() {
    this.recipeService.addSoppingListRecipe(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDelete() {
    this.recipeService.onDeleteRecipe(this.id);
    this.router.navigate(['recipe']);
  }

  ngOnChanges() {
  }

}
