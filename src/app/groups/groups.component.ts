import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Router, ActivatedRoute } from '@angular/router';
import { tap, switchMap } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import * as GroupsAction from './store/groups.actions';
import { Group } from '../shared/models/group.model';
import { Guest } from '../shared/models/guest.model';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styles:  [`
    .bg-screen{display: inline-block}
    .sm-screen{display: none}
    
    @media only screen and (max-width:  700px){
        .sm-screen{display: inline-block}
        .bg-screen{display: none}
    }
    `]
})
export class GroupsComponent implements OnInit, OnDestroy {

  groups: Group[];
  guests: Guest[];
  isLoading:boolean;
  errorMessage:string;
  dataChart = [];
  bgChartOptions = {};
  smChartOptions = {};

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.store.select('guests')
      .pipe(
        untilDestroyed(this),
        tap((data) => { this.guests = data.guests }),
        switchMap(() => {
          return this.store.select('groups')
            .pipe(untilDestroyed(this))
        })
      )
      .subscribe((res) => {
        this.isLoading = res.isLoading;
        this.errorMessage = res.errorMessage;
        this.groups = res.groups;
        this.initDataCharts();
      })
  }

  ngOnDestroy() {
    this.onCloseMessage();
  }

  initDataCharts() {
    this.dataChart = [];
    let colors = [];
    this.bgChartOptions = null;
    this.smChartOptions = null;
    this.groups.forEach((g, index) => {
      const col = [g.name, this.getGuestByGroupIndex(index)];
      if (col[1] !== 0) {
        this.dataChart.push(col);
        colors.push(g.color);
      }
    })

    this.smChartOptions = {
      width: 270,
      chartArea: { left: '10%', top: '10%', width: '60%', height: '80%' },
      backgroundColor: { fill: 'transparent' },
      legend: { position: 'top', maxLines: 3 },
      colors: colors,
      is3D: true,
    };

    this.bgChartOptions = {
      width: 700,
      height: 350,
      chartArea: { top: '10%', width: '60%', height: '80%' },
      backgroundColor: { fill: 'transparent' },
      legend: { position: 'top', maxLines: 3 },
      colors: colors,
      is3D: true,
    }
  }

  onCloseMessage(){
    if(this.errorMessage ){
      this.store.dispatch(new GroupsAction.ClearMessage());
    }
  }

  getGuestByGroupIndex(i: number) {
    let guests: number = 0;
    this.guests.forEach(guest => {
      if (guest.group.trim() === this.groups[i].name.trim()) {
        if (guest.companions) {
          guests += guest.companions.length + 1;
        }else{
          guests += 1
        }
      }
    })
    return guests;
  }

  onCreateNewGroup() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onSelectColumn(any) {
    if (any[0]) {
      this.router.navigate([any[0].row], { relativeTo: this.route })
    }
  }

}
