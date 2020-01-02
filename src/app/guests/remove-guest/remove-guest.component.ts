import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { tap, switchMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as GuestsAction from '../store/guests.actions';
import * as fromApp from '../../store/app.reducer';
import { Guest } from '../../shared/models/guest.model';

@Component({
  selector: 'app-remove-guest',
  templateUrl: './remove-guest.component.html'
})
export class RemoveGuestComponent implements OnInit, OnDestroy {

  index: number;
  guest: Guest;
  massage:string;
  
  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      untilDestroyed(this),
      tap((param) => {
        this.index = +param['id'];
      }),
      switchMap(() => {
        return this.store.select('guests').pipe(
          untilDestroyed(this),
          map(guestsState => {
            return guestsState.guests.find((guest, index) => {
              guest.id;
              return index === this.index
            });
          })
        )
      })
    ).subscribe((guest: Guest) => {
      if(guest){
        this.guest = guest;
        this.massage = `Are you sure to remove '${this.guest.name}' from your guests list ? `
      }
    });
  }

  ngOnDestroy(){}

  onClose() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  onRemove(){
    this.onClose();
    this.store.dispatch(new GuestsAction.StartRemoveGuset({index:this.index,id:this.guest.id}));
  }

}
