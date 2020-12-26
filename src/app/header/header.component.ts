import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

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
        private authService: AuthService) { }
    ngOnInit() {
        this.unSubscribe = this.authService.user.subscribe(
            authData => {
                this.isAuthenticated = !!authData;
                console.log(!!authData, !authData);
            }
        );
    }

    onLogOut() {
        this.authService.logOut();
    }

    saveData() {
        this.dataStore.storeRecipe();
    }

    fetchRecipe() {
        this.dataStore.fetchRecipe().subscribe();
    }

    ngOnDestroy() {
        this.unSubscribe.unsubscribe();
    }
}
