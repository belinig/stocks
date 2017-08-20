import { Component, OnInit} from '@angular/core';
import { WindowRef } from '../shared/services/windowref.service';
import { Observable } from 'rxjs/Observable';
import { UserModel } from '../core/models/user-model';
import { Store } from '@ngrx/store';
import { IStocksAppState } from '../shared/store/stocks-app-store';
import { IAuthState } from '../shared/store/auth-store/auth.store';
import { UserActions } from '../shared/store/profile/user.actions';

@Component({
    selector: 'app',
    providers: [WindowRef, UserActions],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public authState$: Observable<IAuthState>;

    public constructor(
        public store: Store<IStocksAppState>
    ) { }

    public ngOnInit(): void {
        this.authState$ = this.store.select(state => state.auth);
    }

}
