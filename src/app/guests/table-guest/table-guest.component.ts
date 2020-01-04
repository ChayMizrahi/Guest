import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Store } from '@ngrx/store';

import { Guest } from '../../shared/models/guest.model';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-table-guest',
  templateUrl: './table-guest.component.html',
  styles: [`
      @media only screen and (max-width:700px) {
        .display-only-web{display: none}
        }
  `]
})
export class TableGuestComponent implements OnInit, OnDestroy {

  guests: Guest[] = [];

  constructor(
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.store.select('guests').pipe(
      untilDestroyed(this)
    ).subscribe(data => {
      this.guests = data.guests;
    })
  }

  ngOnDestroy() { }

  getTotalGuest() {
    let total = 0
    this.guests.forEach(g => {
      total += g.companions.length + 1;
    })
    return total;
  }

  onAddGuest(){
    this.router.navigate(['guests', 'new']);
  }

  onInfoGuest(i: number) {
    this.router.navigate(['guests', +i]);
  }

  onUpdateGuest(i: number) {
    this.router.navigate(['guests', +i, 'edit']);
  }

  onRemoveGuest(i: number) {
    this.router.navigate(['guests', +i, 'remove']);
  }

}
