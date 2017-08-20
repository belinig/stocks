import { IAuthState, authReducer } from '../../shared/store/auth-store/auth.store';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { storeFreeze } from 'ngrx-store-freeze';

export interface IStocksAppState {
    auth: IAuthState;
}

const reducers = {
    auth: authReducer
};

const developmentReducer: ActionReducer<IStocksAppState> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<IStocksAppState> = combineReducers(reducers);

export function stocksAppReducer(state: any, action: any) {
    if (process.env.ENV === 'Production') {
        return productionReducer(state, action);
    } else {
        return developmentReducer(state, action);
    }
}
