import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list-actions';
import * as formShoppingList from '../store/shopping-list.reducer';
import * as fromApp from '../../store/app.reducer';
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) formValue: NgForm;
  subscription: Subscription;
  editMode = false;
  myClass = 'fijj';
  editedItem: Ingredient;
  constructor(
    private shoppingService: ShoppingListService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editIngredient) {
        this.editMode = true;
        this.formValue.setValue({
          recipename: stateData.editIngredient.name,
          amount: stateData.editIngredient.amount
        });
      }
    });
    // this.subscription = this.shoppingService.startedEditing.subscribe(
    //   (index: number) => {
    //     this.editMode = true;
    //     this.editedItemIndex = index;
    //     this.editedItem = this.shoppingService.getIngredient(index);
    //     this.formValue.setValue({
    //       recipename: this.editedItem.name,
    //       amount: this.editedItem.amount
    //     });
    //   }
    // );
  }

  addIngredients() {
    const ingName = this.formValue.value.recipename;
    const ingAmount = this.formValue.value.amount;
    const newIngredients = new Ingredient(ingName, ingAmount);
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredients));
      // this.shoppingService.updateIngredient(this.editedItemIndex, newIngredients);
      this.editMode = false;
      this.resetForm();
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredients));
      // this.shoppingService.addIngredient(newIngredients);
      this.resetForm();
    }
    // this.addedIngredient.emit({name: this.nameInput.nativeElement.value, amount: +amountInput.value});
  }

  resetForm() {
    this.formValue.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  deleteSohppingListItem() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    // this.shoppingService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.StopEdit());
    this.resetForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
