import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

export const AuthReadyActionTypes = {
    READY: "READY"
};

@Injectable()
export class AuthReadyActions {
    public ready(): Action {
        return {
            type: AuthReadyActionTypes.READY
        };
    }
}
