import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { switchMap, tap, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';

import * as fromApp from '../../store/app.reducer';
import { Group } from '../../shared/models/group.model';
import { Guest, Status } from 'src/app/shared/models/guest.model';

export class customGuest {
  constructor(
    public name: string,
    public status: Status
  ) { }
}

@Component({
  selector: 'app-info-group',
  templateUrl: './info-group.component.html'
})
export class InfoGroupComponent implements OnInit, OnDestroy {

  index: number;
  group: Group;
  customGuests: customGuest[];
  mainSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      untilDestroyed(this),
      tap((param) => { this.index = +param['id'] }),
      switchMap((param) => {
        return this.store.select('groups').pipe(
          untilDestroyed(this),
          tap((data) => { this.group = data.groups[this.index] })
        )
      }),
      switchMap(data => {
        return this.store.select('guests').pipe(
          untilDestroyed(this),
          map(data => {
            return data.guests.filter((guest) => { 
              return guest.group === this.group.name })
          }))
      })
    ).subscribe((res: Guest[]) => {
      this.initCustomGuests(res);
    })
  }

  ngOnDestroy() {}

  onClose() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  initCustomGuests(guests:Guest[]) {
    this.customGuests = [];
    guests.forEach((guest) => {
      const main = new customGuest(guest.name, guest.status);
      this.customGuests.push(main);
      if (guest.companions) {
        guest.companions.forEach(c => {
          const child = new customGuest(`${c.name} (${main.name.trim()})`, c.status);
          this.customGuests.push(child);
        })
      }
    })
  }
  

}
