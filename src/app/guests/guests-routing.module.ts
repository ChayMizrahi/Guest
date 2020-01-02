import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { GuestsComponent } from './guests.component';
import { AuthGuardService } from '../auth/auth.guard';
import { GuestsResolverService } from './guests-resolver.service';
import { GroupResolverService } from '../groups/group-resolver.service';
import { EditGuestComponent } from './edit-guest/edit-guest.component';
import { GuestComponent } from './guest/guest.component';
import { RemoveGuestComponent } from './remove-guest/remove-guest.component';

const routes: Routes = [
    {
        path: '', component: GuestsComponent, canActivate: [AuthGuardService],resolve: [GuestsResolverService, GroupResolverService], children: [
          { path: 'new', component: EditGuestComponent, resolve: [GroupResolverService] },
          { path: ':id', component: GuestComponent, resolve: [GroupResolverService] },
          { path: ':id/edit', component: EditGuestComponent, resolve: [GroupResolverService, GuestsResolverService] },
          { path: ':id/remove', component: RemoveGuestComponent, resolve: [GroupResolverService, GuestsResolverService] }
        ]
      }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class GuestsRoutingModule {

}