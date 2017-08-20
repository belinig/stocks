import { Action } from '@ngrx/store';
import { UserModel } from '../../../models/user-model';
import { Injectable } from '@angular/core';

export const UserActionTypes = {
    LOAD: 'LOAD',
    DELETE: 'DELETE'
};

@Injectable()
export class UserActions {
    public load(payload: UserModel): Action {
        return {
            type: UserActionTypes.LOAD,
            payload
        };
    }
    public delete(): Action {
        return {
            type: UserActionTypes.DELETE
        };
    }
}
