import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';

import * as fromApp from '../store/app.reducer'
import * as AuthAction from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles:[`
  .pointer {cursor: pointer;}
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLogin:boolean;

  constructor(
    private store:Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.store.select('auth')
    .pipe(untilDestroyed(this))
    .subscribe(data=>{
      this.isLogin = data.user !== null ? true : false;
    })
  }

  ngOnDestroy(){}

  onLogout(){
    this.store.dispatch(new AuthAction.Logout());
  }
}
