import { User } from '../user.model';
import * as AuthActions from './auth.action';
import { AUTHENTICATE_FAIL } from './auth.action';
export interface State {
    user: User;
    authError: string;
    loading: boolean;
}

export const initialState: State = {
    user: null,
    authError: null,
    loading: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
    switch (action.type) {
        case AuthActions.AUTHENTICATE_SUCCESS :
            const user = new User(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate);
            return {
                ...state,
                authError: null,
                user,
                loading: false
            };
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null,
            };
        case AuthActions.LOGIN_START:
        case AuthActions.SIGNUP_START:
            return {
                ...state,
                authError: null,
                loading: true
            };
        case AuthActions.AUTHENTICATE_FAIL:
            return {
                ...state,
                authError: action.payload,
                loading: false
            };
        // case AuthActions.SIGNUP_START:
        //     return {
        //         ...state,
        //         authError: null,
        //         loading: true
        //     };
        default:
            return state;
    }
}
