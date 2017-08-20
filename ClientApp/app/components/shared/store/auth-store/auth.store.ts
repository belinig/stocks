import { ActionReducer, combineReducers } from '@ngrx/store';
import { UserModel } from '../../../models/user-model';
import { userReducer } from '../profile/user.reducer';
import { authReadyReducer } from './auth-ready.reducer';
import { loggedInReducer } from './logged-in.reducer';


export interface IAuthState {
    user: UserModel;
    loggedIn: boolean;
    authReady: boolean;
}

const reducers = combineReducers({
    user: userReducer,
    loggedIn: loggedInReducer,
    authReady: authReadyReducer
});

export function authReducer(state: any, action: any): ActionReducer<IAuthState> {
    return reducers(state, action);
}
