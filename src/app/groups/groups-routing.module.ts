import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupsComponent } from './groups.component';
import { EditGroupComponent } from './edit-group/edit-group.component';
import { InfoGroupComponent } from './info-group/info-group.component';
import { RemoveGroupComponent } from './remove-group/remove-group.component';
import { AuthGuardService } from '../auth/auth.guard';
import { GuestsResolverService } from '../guests/guests-resolver.service';
import { GroupResolverService } from './group-resolver.service';

const routes: Routes = [
    {
        path: '', component: GroupsComponent, canActivate: [AuthGuardService], resolve: [GuestsResolverService, GroupResolverService], children: [
            { path: 'new', component: EditGroupComponent, resolve: [GroupResolverService] },
            { path: ':id', component: InfoGroupComponent, resolve: [GuestsResolverService] },
            { path: ':id/edit', component: EditGroupComponent, resolve: [GuestsResolverService, GroupResolverService] },
            { path: ':id/remove', component: RemoveGroupComponent, resolve: [GuestsResolverService] }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GroupsRoutingModule {

}