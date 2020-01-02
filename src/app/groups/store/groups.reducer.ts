import { Group } from '../../shared/models/group.model';
import * as GroupsActions from './groups.actions';
import { REDUCER_FACTORY } from '@ngrx/store';

export interface state {
    groups: Group[];
    isLoading: boolean;
    errorMessage: string;
}

const initialState = {
    groups: [],
    isLoading: false,
    errorMessage: null
}

export function groupsReducer(state = initialState, action: GroupsActions.GroupsActions) {
    switch (action.type) {

        case GroupsActions.FETCH_GROUPS:
        case GroupsActions.START_ADD_GROUP:
        case GroupsActions.START_REMOVE_GROUP:
        case GroupsActions.START_UPDATE_GROUP:
            return {
                ...state,
                isLoading: true,
                errorMessage: null
            }

        case GroupsActions.SET_GROUPS:
            return {
                ...state,
                groups: action.payload,
                isLoading: false,
                errorMessage: null
            }
        case GroupsActions.ADD_GROUP:
            return {
                ...state,
                groups: [...state.groups, action.payload],
                isLoading: false,
                errorMessage: null
            };

        case GroupsActions.REMOVE_GROUP:
            return {
                ...state,
                groups: state.groups.filter((g: Group, index: number) => {
                    return index !== action.payload;
                }),
                isLoading: false,
                errorMessage: null
            };
        case GroupsActions.UPDATE_GROUP:
            const originGroup = state.groups[action.payload.index];
            const updateGroup = { ...originGroup, ...action.payload.newGroup };
            const updateGroups = [...state.groups];
            updateGroups[action.payload.index] = updateGroup;
            return {
                ...state,
                groups: updateGroups,
                isLoading: false,
                errorMessage: null
            };
        case GroupsActions.CLEAR_MESSAGE:
            return {
                ...state,
                successMessage: null,
                errorMessage: null
            };
        case GroupsActions.SET_ERROR:
            return {
                ...state,
                errorMessage: action.payload,
                isLoading:false
            }
            case GroupsActions.CLEAR_STATE:
                return {
                    groups: [],
                    isLoading: false,
                    successMessage: null,
                    errorMessage: null
                }
        default:
            return state;
    }
}