import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { Subscription } from 'rxjs';

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
  editedItemIndex: number;
  editedItem: Ingredient;
  constructor(private shoppingService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.shoppingService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingService.getIngredient(index);
        this.formValue.setValue({
          recipename: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  addIngredients() {
    const ingName = this.formValue.value.recipename;
    const ingAmount = this.formValue.value.amount;
    const newIngredients = new Ingredient(ingName, ingAmount);
    if (this.editMode) {
      this.shoppingService.updateIngredient(this.editedItemIndex, newIngredients);
      this.editMode = false;
      this.resetForm();
    } else {
      this.shoppingService.addIngredient(newIngredients);
      this.resetForm();
    }
    // this.addedIngredient.emit({name: this.nameInput.nativeElement.value, amount: +amountInput.value});
  }

  resetForm() {
    this.formValue.reset();
    this.editMode = false;
  }

  deleteSohppingListItem() {
    this.shoppingService.deleteIngredient(this.editedItemIndex);
    this.resetForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
