import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Group } from '../shared/models/group.model';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as GroupsActions from './store/groups.actions';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class GroupResolverService implements Resolve<Group[]> {

  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('groups').pipe(
      take(1),
      map((groupState) => {
        return groupState.groups;
      }),
      switchMap((groups: Group[]) => {
        if (groups.length === 0) {
          this.store.dispatch(new GroupsActions.FetchGroups());
          return this.actions$.pipe(
            ofType(GroupsActions.SET_GROUPS),
            take(1)
          );
        } else {
          return of(groups);
        }
      })
    )

  }
}
