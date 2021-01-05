import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import * as FromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.action';
import * as RecipeActions from '../recipes/store/recipe.action';
import { Store } from '@ngrx/store';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    unSubscribe: Subscription;
    constructor(
        private dataStore: DataStorageService,
        private authService: AuthService,
        private store: Store<FromApp.AppState>) { }
    ngOnInit() {
        this.unSubscribe = this.store.select('auth').subscribe(
            authData => {
                this.isAuthenticated = !!authData.user;
                console.log(!!authData.user, !authData.user);
            }
        );
    }

    onLogOut() {
        // this.authService.logOut();
        this.store.dispatch(new AuthActions.Logout());
    }

    saveData() {
        // this.dataStore.storeRecipe();
        this.store.dispatch(new RecipeActions.StoreRecipes());
    }

    fetchRecipe() {
        this.store.dispatch(new RecipeActions.FetchRecipe());
        // this.dataStore.fetchRecipe().subscribe();
    }

    ngOnDestroy() {
        this.unSubscribe.unsubscribe();
    }
}
