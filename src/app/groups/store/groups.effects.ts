import { Actions, ofType, Effect } from '@ngrx/effects';
import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, map, catchError } from 'rxjs/operators';

import * as GroupsActions from './groups.actions';
import { Group } from '../../shared/models/group.model';
import { addApiResponse } from 'src/app/guests/store/guests.effects';
import { of } from 'rxjs';

export const errorHandler = (err:HttpErrorResponse)=>{
    let errorMessage:string;
    console.log(err);
    if (!err.error || !err.error.error) {
        errorMessage = 'Unknow error';
    } else {
        errorMessage = (err.error.error.message) 
    }
    return of(new GroupsActions.SetError(errorMessage));
}

@Injectable()
export class GroupEffects {

    @Effect()
    fetchGroups = this.actions$.pipe(
        ofType(GroupsActions.FETCH_GROUPS),
        switchMap(() => {
            return this.http.get('https://myevent-310f4.firebaseio.com/groups.json')
        }),
        map((apiRes) => {
            let theGroups = [];
            for (const key in apiRes) {
                if (apiRes.hasOwnProperty(key)) {
                    theGroups.push(
                        {
                            ...apiRes[key],
                            id: key
                        })
                }
            }
            return theGroups;
        }),
        map((groups: Group[]) => {
            return new GroupsActions.SetGroups(groups);
        }),
        catchError(err=>{
            return errorHandler(err);
        })
    )

    @Effect()
    startAddGroup = this.actions$.pipe(
        ofType(GroupsActions.START_ADD_GROUP),
        switchMap((action: GroupsActions.StartAddGroup) => {
            return this.http.post('https://myevent-310f4.firebaseio.com/groups.json',
                action.payload)
                .pipe(
                    map((groupId: addApiResponse) => {
                        const oldGroup = action.payload;
                        const newGroup = new Group(oldGroup.name, oldGroup.color, groupId.name);
                        return new GroupsActions.AddGroup(newGroup);
                    }),
                    catchError(err=>{
                        return errorHandler(err);
                    })
                )
        })
    )

    @Effect()
    startUpdateGroup = this.actions$.pipe(
        ofType(GroupsActions.START_UPDATE_GROUP),
        switchMap((action: GroupsActions.StartUpdateGroup) => {
            return this.http.put('https://myevent-310f4.firebaseio.com/groups/' + action.payload.newGroup.id + '.json',
                new Group(
                    action.payload.newGroup.name,
                    action.payload.newGroup.color)
            ).pipe(
                map(() => {
                    console.log('o')
                    return new GroupsActions.UpdateGroup(action.payload);
                }),
                catchError(err=>{
                    return errorHandler(err);
                })
            )
        })
    )

    @Effect()
    startRemove = this.actions$.pipe(
        ofType(GroupsActions.START_REMOVE_GROUP),
        switchMap((action: GroupsActions.StartRemoveGroup) => {
            return this.http.delete('https://myevent-310f4.firebaseio.com/groups/' + action.payload.id + '.json').pipe(
                map(() => {
                    return new GroupsActions.RemoveGroup(action.payload.index);
                }),
                catchError(err=>{
                    return errorHandler(err);
                })
            )
        })
    )

    constructor(
        private actions$: Actions,
        private http: HttpClient
    ) { }
}