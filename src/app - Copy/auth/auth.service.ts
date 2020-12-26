import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import {environment} from '../.././environments/environment';
export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTime: any;
    constructor(private http: HttpClient, private route: Router) { }

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey,
            {
                email,
                password,
                returnSecureToken: true
            }).pipe(catchError(errorResponse => this.handleError(errorResponse)), tap(
                resData => {
                    this.handelAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                }
            ));
    }

    autoLogin() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }
        const loadUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        const logOutTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        if (loadUser.token) {
            this.user.next(loadUser);
        }
        this.autoLogOut(logOutTime);
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
            {
                email,
                password,
                returnSecureToken: true
            }).pipe(catchError(errorResponse => this.handleError(errorResponse)), tap(
                resData => {
                    this.handelAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                }
            ));
    }

    logOut() {
        this.user.next(null);
        this.route.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTime) {
            clearTimeout(this.tokenExpirationTime);
        }
        this.tokenExpirationTime = null;
    }

    autoLogOut(expirationDuration: number) {
      console.log(expirationDuration);
      this.tokenExpirationTime = setTimeout(() => {
            this.logOut();
        }, expirationDuration);
    }

    private handelAuthentication(email: string, localId: string, idToken: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, localId, idToken, expirationDate);
        this.user.next(user);
        this.autoLogOut(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        console.log(errorResponse);
        let errorMessage = 'Unexpected error Occure';
        if (!errorResponse.error && !errorResponse.error.error) {
            return throwError(errorMessage);
        }
        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'The email address is already in use by another account';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'The password is invalid or the user does not have a password.';
        }
        return throwError(errorMessage);
    }
}
