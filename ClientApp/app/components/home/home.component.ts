import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { WindowRef } from '../shared/services/windowref.service';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { IStocksAppState } from '../shared/store/stocks-app-store';
import { UserModel } from '../models/user-model'
import { UserActions } from '../shared/store/profile/user.actions'

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    public userMessage: string = "World";
    public state: string = "";
    private userModel: UserModel = null;
    constructor(
        public location: Location,
        private windowRef: WindowRef,
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<IStocksAppState>,
        private userActions: UserActions
    ) { }

    ngOnInit() {
        console.log("HomeComponent ngOnInit");
        this.state = this.route.snapshot.paramMap.get('id');
        console.log("HomeComponent getting user");
        var user: any;
        if (this.windowRef && this.windowRef.nativeWindow && (user in this.windowRef.nativeWindow) && (this.state == "0")) {
            user = this.windowRef.nativeWindow.user;
            //this.store.dispatch(this.loggedInActions.loggedIn());
            const userModel = { username: user.User.DisplayName, loggedIn: true } as UserModel;
            this.store.dispatch(this.userActions.load(userModel));
            this.userModel = userModel;
        }
        console.log("HomeComponent=" + user);
        this.userMessage = "logged user:" + user;
        if (!this.userModel || !this.userModel.loggedIn) {
            this.redirect("login");
        }
    }

    public redirect(route: string): void {
        if (typeof(window) !== 'undefined') {
            const url = window.location.protocol + '//' + window.location.host + "/" + route;
            console.log(url);
            window.location.href = url;
        }
    }
}
