import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

import * as GroupActions from '../store/groups.actions'
import * as fromApp from '../../store/app.reducer';
import * as GuestsActions from '../../guests/store/guests.actions';
import { Group } from '../../shared/models/group.model';
import { Guest } from 'src/app/shared/models/guest.model';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css']
})
export class EditGroupComponent implements OnInit, OnDestroy {

  editMode: boolean;
  index: number;
  groups: Group[];
  guests: Guest[];
  groupId: string;
  groupForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.store.select('guests')
      .pipe(untilDestroyed(this))
      .subscribe(data => { this.guests = data.guests });
    this.route.params.pipe(
      untilDestroyed(this),
      tap((param: Params) => {
        this.index = +param['id'];
        this.editMode = this.index >= 0 ? true : false;
      }),
      switchMap(() => {
        return this.store.select('groups').pipe(untilDestroyed(this));
      })
    ).subscribe((data) => {
      this.groups = data.groups;
      this.groupId = this.editMode ? this.groups[this.index].id : null;
      this.initForm();
    })
  }

  ngOnDestroy() {
  }

  initForm() {
    let groupName = this.editMode ? this.groups[this.index].name : null;
    let groupColor = this.editMode ? this.groups[this.index].color : '#f7f3cf';
    this.groupForm = new FormGroup({
      'name': new FormControl(groupName, [Validators.required, this.uniqeName.bind(this)]),
      'color': new FormControl(groupColor, Validators.required)
    })
  }

  uniqeName(control: FormControl): { [f: string]: boolean } {
    let origanGroups = this.editMode ?
      this.groups.filter((group, index) => { return index !== this.index })
      : this.groups;
    const exists = origanGroups.filter(group => { return group.name === control.value });
    if (exists.length > 0) {
      return { 'uniqueName': true };
    }
    return null;
  }

  onClear() {
    this.groupForm.reset({ color: '#f7f3cf' });
  }

  onSubmit() {
    const newGroup: Group = this.groupForm.value;
    if (this.editMode) {
      if (this.groups[this.index].name !== this.groupForm.get('name').value) {
        this.store.dispatch(
          new GuestsActions.StartUpdateGuestsGroup({
            allGuest: this.guests,
            originName: this.groups[this.index].name,
            newName: this.groupForm.get('name').value
          }))
      }
      const updateGroup = new Group(newGroup.name, newGroup.color, this.groupId);
      this.store.dispatch(new GroupActions.StartUpdateGroup({ newGroup: updateGroup, index: this.index }))
    } else {
      this.store.dispatch(new GroupActions.StartAddGroup(newGroup));
    }
    this.onClear();
    this.onClose();
  }

  onClose() {
    if (this.editMode) {
      this.router.navigate(['../../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

}
