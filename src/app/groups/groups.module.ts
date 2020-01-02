import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GroupsComponent } from './groups.component';
import { GroupComponent } from './group/group.component';
import { EditGroupComponent } from './edit-group/edit-group.component';
import { InfoGroupComponent } from './info-group/info-group.component';
import { RemoveGroupComponent } from './remove-group/remove-group.component';
import { GroupsRoutingModule } from './groups-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        GroupsComponent,
        GroupComponent,
        EditGroupComponent,
        InfoGroupComponent,
        RemoveGroupComponent,
    ],
    imports:[
        RouterModule, 
        SharedModule, 
        GroupsRoutingModule
    ]
})
export class GroupsModule {

}