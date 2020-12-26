import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { LoaddingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PlaceHolderDirective } from './placeholder/placeholder.directive';
import { DropdownDirective } from './dropdown.directive';

@NgModule({
    declarations: [AlertComponent, LoaddingSpinnerComponent, PlaceHolderDirective, DropdownDirective],
    imports: [CommonModule],
    exports: [CommonModule, AlertComponent, LoaddingSpinnerComponent, PlaceHolderDirective, DropdownDirective],
    entryComponents: [AlertComponent]
})
export class SharedModule {}
