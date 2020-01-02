import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GoogleChartsModule } from 'angular-google-charts';

import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
    declarations: [LoadingComponent],
    imports: [
        CommonModule,
        GoogleChartsModule.forRoot(),
        ReactiveFormsModule
    ],
    exports: [
        LoadingComponent,
        CommonModule,
        GoogleChartsModule,
        ReactiveFormsModule
    ]
})
export class SharedModule { } 