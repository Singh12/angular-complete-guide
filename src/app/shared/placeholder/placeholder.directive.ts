import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appPlaceHolder]'
})
export class PlaceHolderDirective {
    // You need to import Viewcontainer from core.
    // this automaticaly give access to the reference , to a pointer at the place where this directive is then used
    // So this will allow you to get information about the place where you can use the directive
    // this can be access publicaly
    constructor(public viewContainerRef: ViewContainerRef) {}
}
