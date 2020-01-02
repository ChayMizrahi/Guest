import * as GuestsActions from './guests.actions';
import { Guest } from '../../shared/models/guest.model';

export interface state {
    guests: Guest[];
    isLoading: boolean;
    errorMessage: string;
}

const initialState = {
    guests: null,
    isLoading: false,
    errorMessage: null
}

export function guestsReducer(state = initialState, action: GuestsActions.GuestsActions) {

    switch (action.type) {
        case GuestsActions.FETCH_GUESTS:
        case GuestsActions.START_REMOVE_GUEST:
        case GuestsActions.START_UPDATE_GUEST:
        case GuestsActions.START_ADD_GUEST:
            return {
                ...state,
                isLoading: true,
                errorMessage: null
            }

        case GuestsActions.SET_GUESTS:
            return {
                ...state,
                guests: action.payload,
                isLoading: false
            };
        case GuestsActions.ADD_GUEST:
            
            return {
                ...state,
                guests: [ action.payload, ...state.guests],
                isLoading: false
            };
        case GuestsActions.UPDATE_GUEST:
            const originGuest = state.guests[action.payload.index];
            const updateGuest = { ...originGuest, ...action.payload.updateGuset };
            const updateGuests = [...state.guests];
            updateGuests[action.payload.index] = updateGuest;
            return {
                ...state,
                guests: updateGuests,
                isLoading: false
            };
        case GuestsActions.REMOVE_GUEST:
            return {
                ...state,
                guests: state.guests.filter((guest, index) => { return index !== action.payload }),
                isLoading: false
            };
        case GuestsActions.UPDATE_GUESTS_GROUP:
            return {
                ...state,
                guests: action.payload,
                isLoading: false
            }

        case GuestsActions.SET_ERROR:
            return {
                ...state,
                isLoading: false,
                errorMessage: action.payload
            }
        case GuestsActions.CLEAR_MESSAGE:
            return {
                ...state,
                errorMessage: null
            }
        case GuestsActions.CLEAR_STATE:
            return {
                guests: [],
                isLoading: false,
                errorMessage: null
            }
        default:
            return state;
    }
}