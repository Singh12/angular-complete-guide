import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import * as FromAuth from '../store/app.reducer';
import { Store } from '@ngrx/store';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private store: Store<FromAuth.AppState>) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.store.select('auth').pipe(take(1),
        map(authState => authState.user),
        exhaustMap(user => {
            if (!user) {
                return next.handle(req);
            }
            const modifyRequest = req.clone({ params: req.params.append('auth', user.token) });
            return next.handle(modifyRequest);
        }));
    }
}
