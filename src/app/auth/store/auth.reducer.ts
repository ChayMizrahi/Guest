import * as AuthActions from './auth.actions';
import { User } from '../../shared/models/user.model';

export interface state {
    user: User;
    error: string;
    isLoading: boolean;
}

const initialState = {
    user: null,
    error: null,
    isLoading: false
}

export function guestsReducer(state = initialState, action: AuthActions.AuthActions) {
    switch (action.type) {
        case AuthActions.START_LOGIN:
            return {
                ...state,
                error: null,
                isLoading: true
            }
        case AuthActions.START_SIGN_UP:
            return {
                ...state,
                error: null,
                isLoading: true
            }
        case AuthActions.AUTHENTICATION_SUCCESS:
            return {
                ...state,
                user: action.payload,
                error: null,
                isLoading: false
            };
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null
            }
        case AuthActions.AUTHENTICATION_FAIL:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            }
        default:
            return state;
    }
}