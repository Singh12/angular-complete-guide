import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.action';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';
// Actions is one big observable. This is such a strim of such action.
export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (resData: AuthResponseData) => {
    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    // This will auto dispath the observabel
    const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess(
        {
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate,
            redirect: true
         });
};

const handleError = (errorResponse) => {
    let errorMessage = 'Unexpected error Occure';
    if (!errorResponse.error && !errorResponse.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
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
    return of(new AuthActions.AuthenticateFail(errorMessage));
    // we have to return non error obsevable we should not break our stream of data
    // of is a utility method that will return as observable
};
// we don't proivde provideIn rootIn so it will not inject itself but others can be injectable like http service
@Injectable()
export class AuthEffects {
    // We need to add decoretor to turn on the effects for the authlogin
    // It is on going observable stream this must not die as long as this application run
    @Effect()
    authSignUp = this.action$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((authData: AuthActions.SignUpStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey,
            {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
            }).pipe(
                tap((resData: AuthResponseData) => {
                    this.authService.setLogoutTime(+resData.expiresIn * 1000);
                }),
                map((resData: AuthResponseData) => {
                return handleAuthentication(resData);
            }), catchError(errorResponse => {
                return handleError(errorResponse);
            }));
        })
    );
    @Effect()
    authLogin = this.action$.pipe(
        // All other effect will not trigger here only login start will and it reurn as a observable
        // First step is filtring
        ofType(AuthActions.LOGIN_START),
        // retrun it as observable
        switchMap((AuthData: AuthActions.LoginStart) => {
            /// it will retun a new observable
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
                {
                    email: AuthData.payload.email,
                    password: AuthData.payload.password,
                    returnSecureToken: true
                }).pipe(
                    tap((resData: AuthResponseData) => {
                        this.authService.setLogoutTime(+resData.expiresIn * 1000);
                    }),
                    map((resData: AuthResponseData) => {
                    return handleAuthentication(resData);
                }), catchError(errorResponse => {
                    return handleError(errorResponse);
                }));
        })
    );
    @Effect({ dispatch: false })
    authRedirect = this.action$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
            if (authSuccessAction.payload.redirect) {
                this.router.navigate(['/']);
            }
        })
    );
    @Effect()
    autoLogin = this.action$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                return {type: 'Some Dummy value'};
            }
            const loadUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
            const logOutTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            if (loadUser.token) {
                this.authService.setLogoutTime(logOutTime);
                return new AuthActions.AuthenticateSuccess(
                    {
                        email: userData.email,
                        userId: userData.id,
                        token: userData._token,
                        expirationDate: new Date(userData._tokenExpirationDate),
                        redirect: false
                    });
                // this.user.next(loadUser);
            }
            return {type: 'Some Dummy value'};
           // this.autoLogOut(logOutTime);
        })
    );
    @Effect({ dispatch: false })
    authLogout = this.action$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTime();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })
    );
    constructor(private action$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) { }
}
