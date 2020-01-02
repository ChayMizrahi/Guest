import { Injectable, OnDestroy } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Guest } from '../shared/models/guest.model';
import * as fromApp from '../store/app.reducer'
import * as GuestsAction from './store/guests.actions';

@Injectable({
  providedIn: 'root'
})
export class GuestsResolverService implements Resolve<Guest[]>, OnDestroy{

  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('guests').pipe(
      untilDestroyed(this),
      take(1),
      map((guestState) => {
        return guestState.guests;
      }),
      switchMap((guests: Guest[]) => {
        if (!guests || guests.length === 0) {
          this.store.dispatch(new GuestsAction.FetchGuests());
          return this.actions$.pipe(
            untilDestroyed(this),
            ofType(GuestsAction.SET_GUESTS),
            take(1)
          );
        } else {
          return of(guests);
        }
      })
    )
  }

  ngOnDestroy(){}
}
