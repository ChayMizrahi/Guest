import { Action } from '@ngrx/store';

import { User } from '../../shared/models/user.model';

export const START_LOGIN = "[Auth] Start Login";
export const START_SIGN_UP ="[Auth] Start Sign Up";
export const AUTO_LOGIN = "[Auth] Auto Login";
export const LOGOUT ="[Auth] Logout";
export const AUTHENTICATION_SUCCESS = "[Auth] Authentication Success";
export const AUTHENTICATION_FAIL = "[Auth] Authentication Fail";

export class StartLogin implements Action {
    readonly type = START_LOGIN;
    constructor(public payload: { email: string, password: string }) { }
}

export class StartSignUp implements Action{
    readonly type = START_SIGN_UP;
    constructor(public payload:{ email: string, password: string }){}
}

export class Logout implements Action{
    readonly type = LOGOUT;
}

export class AutoLogin implements Action{
    readonly type = AUTO_LOGIN;
}

export class AuthenticationSuccess implements Action{
    readonly type = AUTHENTICATION_SUCCESS;
    constructor(public payload:User){}
}

export class FailAuthenticate implements Action{
    readonly type = AUTHENTICATION_FAIL;
    constructor(public payload:string){}
}

export type AuthActions = 
StartLogin | 
StartSignUp |
AuthenticationSuccess | 
FailAuthenticate | 
Logout| 
AutoLogin;