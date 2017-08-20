import { Action } from '@ngrx/store';
import { UserModel } from '../../../models/user-model';
import { UserActionTypes } from './user.actions';

const initialState: UserModel = {
    username: null,
    loggedIn: false
};

export function userReducer(state = initialState, action: Action): UserModel {
    switch (action.type) {
        case UserActionTypes.LOAD:
            return action.payload;

        case UserActionTypes.DELETE:
            return initialState;

        default:
            return state;
    }
}
