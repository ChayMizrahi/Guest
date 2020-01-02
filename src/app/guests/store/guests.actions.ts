import { Action } from '@ngrx/store'
import { Guest } from '../../shared/models/guest.model';

export const FETCH_GUESTS = '[Guests] Fetch Guests';
export const SET_GUESTS = '[Guests] Set Guests';

export const START_ADD_GUEST = '[Guests] Start Add Guest';
export const ADD_GUEST = '[Guests] Add Guest';

export const START_UPDATE_GUEST = '[Guests] Start Update Guest';
export const UPDATE_GUEST = '[Guests] Update Guest';

export const START_REMOVE_GUEST = '[Guests] Start Remove Guest';
export const REMOVE_GUEST = '[Guests] Remove Guest';

export const START_UPDATE_GUESTS_GROUP = '[Guests] Start Update guests Group'
export const UPDATE_GUESTS_GROUP ='[Guests] Updat Guests Group';

export const CLEAR_STATE = '[Guests] Clear State';
export const CLEAR_MESSAGE = '[Guests] Clear Message';
export const SET_ERROR = '[Guests] Set Error';

export class FetchGuests implements Action{
    readonly type = FETCH_GUESTS;
}

export class SetGuests implements Action{
    readonly type = SET_GUESTS;
    constructor(public payload:Guest[]){}
}

export class StartAddGuest implements Action{
    readonly type = START_ADD_GUEST;
    constructor(public payload:Guest){}
}

export class AddGuset implements Action {
    readonly type = ADD_GUEST;
    constructor(public payload:Guest){}
}

export class StartUpdateGuset implements Action {
    readonly type = START_UPDATE_GUEST;
    constructor(public payload:{updateGuset:Guest, index:number}){}
}

export class UpdateGuset implements Action {
    readonly type = UPDATE_GUEST;
    constructor(public payload:{updateGuset:Guest, index:number}){}
}

export class RemoveGuset implements Action {
    readonly type = REMOVE_GUEST;
    constructor(public payload:number){}
}

export class StartRemoveGuset implements Action {
    readonly type = START_REMOVE_GUEST;
    constructor(public payload: {index:number, id:string}){}
}

export class StartUpdateGuestsGroup implements Action{
    readonly type = START_UPDATE_GUESTS_GROUP;
    constructor(public payload:{allGuest:Guest[], originName:string, newName:string}){}
}

export class UpdateGuestsGroup implements Action {
    readonly type = UPDATE_GUESTS_GROUP;
    constructor(public payload:Guest[]){}
}

export class ClearMessage implements Action{
    readonly type = CLEAR_MESSAGE;
}

export class ClearState implements Action{
    readonly type = CLEAR_STATE;
}

export class SetError implements Action{
    readonly type = SET_ERROR;
    constructor(public payload:string){}
}

export type GuestsActions = 
FetchGuests |
SetGuests |
AddGuset | 
RemoveGuset | 
UpdateGuset | 
StartAddGuest |
StartRemoveGuset| 
StartUpdateGuset|
UpdateGuestsGroup|
StartUpdateGuestsGroup|
ClearState|
ClearMessage|
SetError;