import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap, switchMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { Guest } from '../../shared/models/guest.model';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html'
})
export class GuestComponent implements OnInit, OnDestroy {

  guest: Guest;
  allGuests: Guest[];
  index: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.route.params.pipe(
      untilDestroyed(this),
      tap((param) => {
        this.index = +param['id'];
      }),
      switchMap(() => {
        return this.store.select('guests').pipe(
          untilDestroyed(this),
          tap(guestState => {
            this.allGuests = guestState.guests;
          }),
          map(guestsState => {
            return guestsState.guests.find((guest, index) => {
              return index === this.index
            });
          })
        )
      })
    ).subscribe((guest: Guest) => {
      this.guest = guest;
    });
  }

  ngOnDestroy(){}

  getTotalGuestByGroup(): number {
    let totalGuests: number = 0;
    this.allGuests.forEach(guest => {
      if (guest.group === this.guest.group) {
        totalGuests += guest.companions.length + 1;
      }
    })
    return totalGuests;
  }

  onClose() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
