import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenExpireationTimer;

  constructor(
    private store: Store<fromApp.AppState>,
  ) { }

  setExpirationTimer(duration: number) {
    this.tokenExpireationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, duration);
  }

  clearExpirationTimer() {
    if (this.tokenExpireationTimer) {
      clearTimeout(this.tokenExpireationTimer);
      this.tokenExpireationTimer = null;
    }
  }

 

}
