import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';

import * as fromApp from '../store/app.reducer'
import * as GuestsAction from './store/guests.actions';
import { Guest, Status } from '../shared/models/guest.model';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.css']
})
export class GuestsComponent implements OnInit, OnDestroy {

  guests: Guest[];
  isLoading:boolean;
  errorMessage:string;
  chartData = [];
  bgChartOptions = {};
  smChartOptions = {}

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.store.select('guests')
    .pipe(untilDestroyed(this))
    .subscribe(data => {
      this.isLoading = data.isLoading;
      this.guests = data.guests;
      this.errorMessage = data.errorMessage;
      this.initChartInfo();
    })
  }

  ngOnDestroy() {}

  onCloseMessage(){
    if(this.errorMessage ){
      this.store.dispatch(new GuestsAction.ClearMessage());
    }
  }

  initChartInfo() {
    if (this.guests) {
      this.chartData = [];
      let totalGuests = 0;
      this.guests.forEach((guest) => {
        totalGuests += guest.companions ? guest.companions.length + 1 : 1
      })
  
      this.chartData.push(['Total', totalGuests]);
      const col_1 = ['Coming', this.getTotalGusetsByStatus(Status.Coming)];
      if (col_1[1] !== 0) {
        this.chartData.push(col_1);
      }

      const col_2 = ['Probably coming', this.getTotalGusetsByStatus(Status.Probably_Coming)];
      if (col_2[1] !== 0) {
        this.chartData.push(col_2);
      }

      const col_3 = ['Maybe', this.getTotalGusetsByStatus(Status.Maybe)];
      if (col_3[1] !== 0) {
        this.chartData.push(col_3);
      }

      const col_4 = ['Probably not coming', this.getTotalGusetsByStatus(Status.Probably_Not_Coming)];
      if (col_4[1] !== 0) {
        this.chartData.push(col_4);
      }

      const col_5 = ['Not coming', this.getTotalGusetsByStatus(Status.Not_Coming)];
      if (col_5[1] !== 0) {
        this.chartData.push(col_5);
      }


      this.bgChartOptions = {
        width: 750,
        chartArea: { left: '10%', width: '100%', height: '70%' },
        legend: { position: 'top', alignment: 'center', textStyle: { bold: 'true' } },
        forceIFrame: 'true'
      }

      this.smChartOptions = {
        width: 250,
        chartArea: { left: '10%', width: '100%', height: '70%' },
        legend: { position: 'top', alignment: 'center', textStyle: { bold: 'true' } },
        forceIFrame: 'true'
      }

    }
  }

  private getTotalGusetsByStatus(status: Status): number {
    let totalGuests = 0;
    this.guests.forEach((guest) => {
      totalGuests += guest.status === status ? 1 : 0;
      if (guest.companions) {
        guest.companions.forEach(child => {
          totalGuests += child.status === status ? 1 : 0;
        })
      }
    })
    return totalGuests;
  }

  onOpenAdd() {
    this.router.navigate(['new'], { relativeTo: this.route })
  }

  onOpenEdit(i: number) {
    this.router.navigate([i, 'edit'], { relativeTo: this.route })
  }

  onOpenRemove(i: number) {
    this.router.navigate([i, 'remove'], { relativeTo: this.route });
  }
}
