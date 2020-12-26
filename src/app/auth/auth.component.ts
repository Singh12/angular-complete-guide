import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';
// Import alert component
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
    isLoginMode = true;
    error: string = null;
    sometext = 'hackerearth';
    isLoading = false;
    isAuthenticated = false;
    private closeSub: Subscription;
    // appPlaceHolder look first occurance in dom
    @ViewChild(PlaceHolderDirective, { static: false }) alertHost: PlaceHolderDirective;
    constructor(
        private authService: AuthService,
        private route: Router,
        private componentFactoryResolver: ComponentFactoryResolver) { }
    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }
    onSubmit(authForm: NgForm) {
        if (!authForm.valid) {
            return;
        }
        const email = authForm.value.email;
        const password = authForm.value.password;
        let authObs = new Observable<AuthResponseData>();
        if (this.isLoginMode) {
            this.isLoading = true;
            authObs = this.authService.login(email, password);
        } else {
            this.isLoading = true;
            authObs = this.authService.signUp(email, password);
        }
        authObs.subscribe(
            data => {
                this.isLoading = false;
                this.route.navigate(['/recipe']);
            }, errorMessage => {
                this.isLoading = false;
                this.error = errorMessage;
                this.showErrorAlert(errorMessage);
                console.log(errorMessage);
            }
        );
        authForm.reset();
    }

    closeModel() {
        this.error = null;
    }

    /**
     *  Dyanmic Component code goes here
     *
     */
    private showErrorAlert(message: string) {
        // Pass the type of the component
        const alertComFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        // Using this component we can create concrete component
        // We can attach to our dom
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        // befor we do anything we need to clear hostviewcontainer
        hostViewContainerRef.clear();
        // create component need factory componet
        const componentRef = hostViewContainerRef.createComponent(alertComFactory);
        // Till above dynamic component has created
        // We can interact to the component to pass the data to the componet
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.oncloseModel.subscribe(() => {
            this.closeSub.unsubscribe();
            // to clear all the directive after close
            hostViewContainerRef.clear();
        });
    }

    ngOnDestroy() {
        if (this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }
}
