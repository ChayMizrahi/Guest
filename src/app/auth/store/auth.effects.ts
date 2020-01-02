import { Actions, Effect, ofType } from '@ngrx/effects'
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';

import { User } from '../../shared/models/user.model';
import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { LOCAL_STORAGE_USER_DATA } from '../../shared/app.consts';
import { AuthService } from '../auth.service';
import * as fromApp from '../../store/app.reducer';
import * as GroupsActions from '../../groups/store/groups.actions';
import * as GuestsActions from '../../guests/store/guests.actions'; 


export interface AuthResponse {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

export const successAuthentication = (authResponse: AuthResponse) => {
    const expirationDate: Date = new Date(new Date().getTime() + (+authResponse.expiresIn * 1000));
    const user: User = new User(authResponse.email, authResponse.localId, authResponse.idToken, expirationDate, true);
    localStorage.setItem(LOCAL_STORAGE_USER_DATA, JSON.stringify(user));
    return new AuthActions.AuthenticationSuccess(user);
}

export const FailAuthentication = (err: HttpErrorResponse) => {
    let errorMessage = 'Unknow error';
    if (!err.error || !err.error.error) {
        return of(new AuthActions.FailAuthenticate(errorMessage));
    } else {
        switch (err.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = "The email address is already in use by another account.";
                break;
            case 'OPERATION_NOT_ALLOWED':
                errorMessage = 'Password sign-in is disabled for this project.';
                break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.'
                break;

            case 'EMAIL_NOT_FOUND':
                errorMessage = "The email not found."
                break;

            case 'INVALID_PASSWORD':
                errorMessage = 'The password is incorract.';
                break;

            case 'USER_DISABLED':
                errorMessage = 'The user account has been disabled by an administrator.';
                break;
        }
        return of(new AuthActions.FailAuthenticate(errorMessage));
    }
}

@Injectable()
export class AuthEffects {

    @Effect()
    startLogin = this.actions$.pipe(
        ofType(AuthActions.START_LOGIN),
        switchMap((dataAuth: AuthActions.StartLogin) => {
            return this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey, {
                email: dataAuth.payload.email,
                password: dataAuth.payload.password,
                returnSecureToken: true
            }).pipe(
                tap((user: AuthResponse) => {
                    this.authService.setExpirationTimer(+user.expiresIn * 1000);
                }),
                map((user: AuthResponse) => {
                    return successAuthentication(user);
                }),
                catchError((err: HttpErrorResponse) => {
                    return FailAuthentication(err);
                })
            )
        }),

    )

    @Effect()
    startSignUp = this.actions$.pipe(
        ofType(AuthActions.START_SIGN_UP),
        switchMap((dataAuth: AuthActions.StartSignUp) => {
            return this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey, {
                email: dataAuth.payload.email,
                password: dataAuth.payload.password,
                returnSecureToken: true
            }).pipe(
                tap((user: AuthResponse) => {
                    this.authService.setExpirationTimer(+user.expiresIn * 1000);
                }),
                map((user: AuthResponse) => {
                    return successAuthentication(user);
                }),
                catchError((err: HttpErrorResponse) => {
                    return FailAuthentication(err);
                })
            )
        }),
    )
    @Effect({ dispatch: false })
    logout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap((action: AuthActions.Logout) => {
            this.store.dispatch(new GroupsActions.ClearState());
            this.store.dispatch(new GuestsActions.ClearState()); 
            this.authService.clearExpirationTimer();
            this.router.navigate(['/auth']);
            localStorage.removeItem(LOCAL_STORAGE_USER_DATA);
        })
    )


    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map((data: Action) => {
            const userJson = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_DATA));
            if (userJson) {
                const user: User = new User(
                    userJson.email,
                    userJson.userId,
                    userJson._token,
                    new Date(userJson._tokenExpirationDate),
                    false);
                if (user.token) {
                    let expirationDate = new Date(userJson._tokenExpirationDate).getTime() -
                        new Date().getTime();
                    this.authService.setExpirationTimer(expirationDate);
                    return new AuthActions.AuthenticationSuccess(user);
                } else {
                    return { type: 'Dummy' };
                }
            } else {
                return { type: 'Dummy' };
            }

        })
    )

    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATION_SUCCESS),
        tap((authSuccess: AuthActions.AuthenticationSuccess) => {
            if (authSuccess.payload.redirect) {
                this.router.navigate(['/']);
            }
        })
    )

    constructor(
        private router: Router,
        private actions$: Actions,
        private authService: AuthService,
        private http: HttpClient,
        private store:Store<fromApp.AppState>
    ) { }
}