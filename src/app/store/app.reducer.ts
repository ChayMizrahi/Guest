import { ActionReducerMap } from '@ngrx/store';

import * as fromGroups from '../groups/store/groups.reducer';
import * as fromGuests from '../guests/store/guests.reducer';
import * as fromAuth from '../auth/store/auth.reducer';

export interface AppState {
    groups: fromGroups.state;
    guests: fromGuests.state;    
    auth: fromAuth.state;
}

export const appReducer: ActionReducerMap<AppState> = {
    groups: fromGroups.groupsReducer,
    guests: fromGuests.guestsReducer,
    auth: fromAuth.guestsReducer
};