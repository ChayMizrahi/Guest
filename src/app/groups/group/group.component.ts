import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

import * as fromApp from '../../store/app.reducer';
import { Guest } from 'src/app/shared/models/guest.model';
import { Group } from '../../shared/models/group.model';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styles: [`
    .group-card{
      border-radius: 15px; 
      padding: .375rem .75rem; 
      border: 2px solid black;
      }`]
})
export class GroupComponent implements OnInit, OnDestroy {

  @Input() group: Group;
  @Input() index: number;
  GuestGroupLength: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.store.select('guests')
      .pipe(
        untilDestroyed(this),
        map((data) => {
          return data.guests.filter(guest => {
            return guest.group === this.group.name;
          })
        })
      )
      .subscribe((guests: []) => {
        this.initGuestGroupLength(guests);
      })
  }

  ngOnDestroy() { }

  initGuestGroupLength(guests: Guest[]) {
    this.GuestGroupLength = 0;
    guests.forEach(guest => {
      if (guest.companions) {
        this.GuestGroupLength += guest.companions.length + 1;
      } else {
        this.GuestGroupLength += 1;
      }
    })
  }

  onInfoGroup() {
    this.router.navigate([this.index], { relativeTo: this.route });
  }

  onEditGroup() {
    this.router.navigate([this.index, 'edit'], { relativeTo: this.route });
  }

  onRemoveGroup() {
    this.router.navigate([this.index, 'remove'], { relativeTo: this.route });
  }
}
