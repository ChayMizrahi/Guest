import { Action } from '@ngrx/store'
import { Group } from '../../shared/models/group.model';
import { StartAddGuest } from 'src/app/guests/store/guests.actions';
import { Actions } from '@ngrx/effects';

export const FETCH_GROUPS = '[Groups] Fetch Groups';
export const SET_GROUPS = '[Groups] Set Groups';

export const ADD_GROUP = '[Groups] Add Group';
export const START_ADD_GROUP = '[Groups] Start Add Group';

export const REMOVE_GROUP = '[Groups] Remove Group';
export const START_REMOVE_GROUP = '[Groups] Start Remove Group';

export const UPDATE_GROUP = '[Groups] Update Group';
export const START_UPDATE_GROUP = '[Groups] Start Update Group';

export const CLEAR_STATE = '[Groups] Clear State'
export const CLEAR_MESSAGE = '[Groups] Clear Message';
export const SET_ERROR = '[Groups] Set Error';

export class FetchGroups implements Action {
    readonly type = FETCH_GROUPS;
}

export class SetGroups implements Action {
    readonly type = SET_GROUPS;
    constructor(public payload: Group[]) { }
}

export class AddGroup implements Action {
    readonly type = ADD_GROUP;
    constructor(public payload: Group) { }
}

export class StartAddGroup implements Action {
    readonly type = START_ADD_GROUP;
    constructor(public payload: Group) { }
}

export class RemoveGroup implements Action {
    readonly type = REMOVE_GROUP;
    constructor(public payload:number) { }
}

export class StartRemoveGroup implements Action {
    readonly type = START_REMOVE_GROUP;
    constructor(public payload: {index:number, id:string}) { }
}

export class UpdateGroup implements Action {
    readonly type = UPDATE_GROUP;
    constructor(public payload: { newGroup: Group, index: number }) { }
}

export class StartUpdateGroup implements Action {
    readonly type = START_UPDATE_GROUP;
    constructor(public payload: { newGroup: Group, index: number }) { }
}

export class ClearMessage implements Action{
    readonly type = CLEAR_MESSAGE;
}

export class SetError implements Action{
    readonly type = SET_ERROR;
    constructor(public payload:string){}
}

export class ClearState implements Action{
    readonly type = CLEAR_STATE;
}

export type GroupsActions =
    FetchGroups |
    SetGroups |
    AddGroup |
    RemoveGroup |
    UpdateGroup |
    StartAddGroup |
    StartRemoveGroup |
    StartUpdateGroup|
    ClearMessage|
    ClearState|
    SetError;