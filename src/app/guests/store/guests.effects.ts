import { Actions, ofType, Effect } from "@ngrx/effects";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import * as GuestsActions from './guests.actions';
import { Guest } from '../../shared/models/guest.model';
import { of } from 'rxjs';

export interface addApiResponse {
    name: string;
}

export const errorHandler = (err:HttpErrorResponse)=>{
    let errorMessage:string;
    console.log(err);
    if (!err.error || !err.error.error) {
        errorMessage = 'Unknow error';
    } else {
        errorMessage = (err.error.error.message) 
    }
    return of(new GuestsActions.SetError(errorMessage));
}

@Injectable()
export class GuestsEffects {

    @Effect()
    getGuests = this.actions$.pipe(
        ofType(GuestsActions.FETCH_GUESTS),
        switchMap(() => {
            return this.http.get
                ('https://myevent-310f4.firebaseio.com/guests.json')
        }),
        map((apiRes) => {
            let theGuests = [];
            for (const key in apiRes) {
                if (apiRes.hasOwnProperty(key)) {
                    theGuests.push(
                        {
                            ...apiRes[key],
                            id: key,
                            companions: apiRes[key].companions ? apiRes[key].companions : []
                        })
                }
            }
            return theGuests;
        }),
        map((guests: Guest[]) => {
            return new GuestsActions.SetGuests(guests);
        }),
        catchError((err)=>{
            return errorHandler(err);
        })
    )

    @Effect()
    sendGuests = this.actions$.pipe(
        ofType(GuestsActions.START_ADD_GUEST),
        switchMap((action: GuestsActions.StartAddGuest) => {
            return this.http.post('https://myevent-310f4.firebaseio.com/guests.json',
                action.payload).
                pipe(
                    map((guestId: addApiResponse) => {
                        const oldGuest = action.payload;
                        const newGuest = new Guest(oldGuest.name, oldGuest.status, oldGuest.group, oldGuest.companions, guestId.name);
                        return new GuestsActions.AddGuset(newGuest);
                    }),
                    catchError((err)=>{
                        return errorHandler(err);
                    })
                )
        })
    );

    @Effect()
    updateGuest = this.actions$.pipe(
        ofType(GuestsActions.START_UPDATE_GUEST),
        switchMap((action: GuestsActions.StartUpdateGuset) => {
            return this.http.put('https://myevent-310f4.firebaseio.com/guests/'+ action.payload.updateGuset.id +'.json',
                new Guest(action.payload.updateGuset.name,
                    action.payload.updateGuset.status,
                    action.payload.updateGuset.group,
                    action.payload.updateGuset.companions)
            ).pipe(
                map(()=>{
                    console.log(action.payload.updateGuset.id)
                    return new GuestsActions.UpdateGuset(action.payload);
                }),
                catchError((err)=>{
                    return errorHandler(err);
                })
            )
        })
    )

    @Effect()
    startRemoveGuest = this.actions$.pipe(
        ofType(GuestsActions.START_REMOVE_GUEST),
        switchMap((action:GuestsActions.StartRemoveGuset)=>{
            return this.http.delete('https://myevent-310f4.firebaseio.com/guests/'+ action.payload.id +'.json').pipe(
                map(()=>{
                    return new GuestsActions.RemoveGuset(action.payload.index);
                }),
                catchError((err)=>{
                    return errorHandler(err);
                })
            )
        })
    )

    @Effect()
    startUpdateGuestsGroup = this.actions$.pipe(
        ofType(GuestsActions.START_UPDATE_GUESTS_GROUP),
        switchMap((action:GuestsActions.StartUpdateGuestsGroup)=>{
            let allGuest = action.payload.allGuest;
            allGuest.forEach(guest=>{
                if(guest.group === action.payload.originName){
                    guest.group = action.payload.newName;
                }
            })
            return this.http.put('https://myevent-310f4.firebaseio.com/guests.json', allGuest).pipe(
                map((guests:Guest[])=>{
                    return new GuestsActions.UpdateGuestsGroup(guests);
                }),
                catchError((err)=>{
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