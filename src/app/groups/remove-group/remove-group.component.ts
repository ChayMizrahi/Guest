import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, map, tap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

import * as GroupActions from '../store/groups.actions'
import * as fromApp from '../../store/app.reducer';
import { Group } from '../../shared/models/group.model';


@Component({
  selector: 'app-remove-group',
  templateUrl: './remove-group.component.html'
})
export class RemoveGroupComponent implements OnInit, OnDestroy {

  index: number;
  group: Group;
  possibleToDelete: boolean;
  massage:string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.route.params.pipe(
      untilDestroyed(this),
      tap((params) => {this.index = +params['id']}),
      switchMap(() => {
        return this.store.select('groups').pipe(
          untilDestroyed(this),
          map((groupStatus) => {
            return groupStatus.groups.find((group, index) => {
              return index === this.index;
            })
          })
        )
      }),
      tap((group: Group) => {this.group = group}),
      switchMap(() => {
        return this.store.select('guests').pipe(
          untilDestroyed(this),
          map(data => {
            return data.guests.filter(guest => {
             return guest.group === this.group.name;
            })
          })
        )
      })
    ).subscribe((res) => {
      this.possibleToDelete = res.length > 0 ? false : true;
      if(this.possibleToDelete){
        this.massage = `Are you sure to remove the group '${this.group.name}' ?`
      }else{
        this.massage = `The group '${this.group.name}' cannot be deleted because guests belong to this group.`
      }
    })
  }

  ngOnDestroy() {}

  onClose() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  onRemove() {
    this.store.dispatch(new GroupActions.StartRemoveGroup({index:this.index,id:this.group.id}));
    this.onClose();
  }

  

}
