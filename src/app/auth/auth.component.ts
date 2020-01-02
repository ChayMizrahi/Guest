import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  loginMode: boolean = true;
  error: string;
  isLoading: boolean;
  subAuth: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subAuth = this.store.select('auth').subscribe(res => {
      this.error = res.error;
      this.isLoading = res.isLoading;
    })
    this.initFrom();
  }

  ngOnDestroy() {
    this.subAuth.unsubscribe()
  }

  initFrom() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
    })
  }

  onSubmit() {
    if (this.loginMode) {
      this.store.dispatch(new AuthActions.StartLogin(this.loginForm.value));
    } else {
      this.store.dispatch(new AuthActions.StartSignUp(this.loginForm.value))
    }
    this.loginForm.reset()
  }

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }

}
