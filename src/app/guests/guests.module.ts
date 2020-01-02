import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableGuestComponent } from './table-guest/table-guest.component';
import { GuestsComponent } from './guests.component';
import { EditGuestComponent } from './edit-guest/edit-guest.component';
import { RemoveGuestComponent } from './remove-guest/remove-guest.component';
import { GuestComponent } from './guest/guest.component';
import { GuestsRoutingModule } from './guests-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations:[
        GuestsComponent,
        TableGuestComponent,
        EditGuestComponent,
        RemoveGuestComponent,
        GuestComponent
    ],
    imports:[
        RouterModule, 
        SharedModule, 
        GuestsRoutingModule
    ]
})
export class GuestsModule {}