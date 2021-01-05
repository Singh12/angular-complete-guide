import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
@Injectable({providedIn: 'root'})
export class AuthGard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
        // const loginToken = JSON.parse(localStorage.getItem('userData'));
        // if (loginToken._token) {
        //     return true;
        // } else {
        //     this.router.navigate(['/']);
        // }
        return this.store.select('auth').pipe(take(1),
        map(authState => authState.user),
        map(user => {
            const isAuth = !!user;
            console.log('I am called', isAuth);
            if (isAuth) {
                return true;
            } else {
              return this.router.createUrlTree(['/auth']);
            }
        }));
    }
}
