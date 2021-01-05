import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as formShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list-actions';
import * as fromApp from '../store/app.reducer';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients: Ingredient[]}>;
  getSubscriptionIngredients: Subscription;
  constructor(
    private shoppingService: ShoppingListService,
    private store: Store<fromApp.AppState>
    ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.shoppingService.getIngredients();
    // this.getSubscriptionIngredients = this.shoppingService.getUpdetedIngerdients.subscribe(
    //   (ingredient) => {
    //     this.ingredients = ingredient;
    //   }
    // );
  }
  selectIngredient(index: number) {
       this.store.dispatch(new ShoppingListActions.StartEdit(index));
    // this.shoppingService.startedEditing.next(index);
  }
  ngOnDestroy() {
    // this.getSubscriptionIngredients.unsubscribe();
  }
}
