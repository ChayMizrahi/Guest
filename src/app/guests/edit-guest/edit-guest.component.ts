import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { tap, switchMap, map, take } from 'rxjs/operators';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { Guest, Status } from '../../shared/models/guest.model';
import { Group } from 'src/app/shared/models/group.model';
import * as GuestsAction from '../store/guests.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-edit-guest',
  templateUrl: './edit-guest.component.html',
  styles: [`
            input.ng-touched.ng-invalid{ border: 1px solid red}
            .childrenInput.ng-invalid{ border: 1px solid red }
  `]
})
export class EditGuestComponent implements OnInit, OnDestroy {

  index: number;
  editMode: boolean;
  guestId: string;
  groups: Group[];
  guestForm: FormGroup;

  constructor(
    private stroe: Store<fromApp.AppState>,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      untilDestroyed(this),
      tap(param => {
        this.index = +param['id'];
        this.editMode = param['id'] ? true : false;
      }),
      switchMap(() => {
        return this.stroe.select('groups').pipe(
          untilDestroyed(this)
        );
      })
    ).subscribe(data => {
      this.groups = data.groups;
      if (this.groups.length > 0) {
        this.initForm();
      }
    })
  }

  ngOnDestroy() { }

  onMoveGroupPage() {
    this.router.navigate(['groups', 'new']);
  }

  onClose() {
    if (this.editMode) {
      this.router.navigate(['../../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  get companionsControls() {
    return (this.guestForm.get('companions') as FormArray).controls;
  }

  initForm() {
    let guestName = null;
    let status = Status.Coming;
    let guestGroup = this.groups[0].name;
    let companions = new FormArray([]);

    if (this.editMode === true) {
      this.stroe.select('guests').pipe(
        take(1),
        map(data => { return data.guests.find((guest, index) => { return index === this.index }) })
      ).subscribe((guest: Guest) => {
        this.guestId = guest.id;
        guestName = guest.name;
        status = guest.status;
        guestGroup = guest.group;
        for (let child of guest.companions) {
          companions.push(
            new FormGroup({
              'name': new FormControl(child.name, Validators.required),
              'status': new FormControl(child.status, [Validators.required, , Validators.max(100), Validators.min(0)])
            })
          )
        }
      })
    }

    this.guestForm = new FormGroup({
      'name': new FormControl(guestName, Validators.required),
      'status': new FormControl(status, Validators.required),
      'group': new FormControl(guestGroup, Validators.required),
      'companions': companions
    })

  }

  onAddGuestChildren() {
    (<FormArray>this.guestForm.get('companions')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'status': new FormControl(Status.Coming, Validators.required)
      })
    )
  }

  onDeleteGuestChildren(index: number) {
    (<FormArray>this.guestForm.get('companions')).removeAt(index);
  }

  onSubmit() {
    let newGuest: Guest = this.guestForm.value;
    if (newGuest.companions.length === 0) {
      newGuest.companions = [];
    }
    if (this.editMode) {
      const updateGuest = new Guest(newGuest.name, newGuest.status, newGuest.group, newGuest.companions, this.guestId)
      this.stroe.dispatch(new GuestsAction.StartUpdateGuset({ updateGuset: updateGuest, index: this.index }));
    } else {
      this.stroe.dispatch(new GuestsAction.StartAddGuest(newGuest));
    }
    this.onClose();

  }



}
