import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { stocksAppReducer } from './components/shared/store/stocks-app-store';
import { AppComponent } from './components/app/app.component'
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { WatchlistsComponent } from './components/watchlists/watchlists.component';
import { CounterComponent } from './components/counter/counter.component';
import { SocialLoginComponent } from './components/login/sociallogin/social-login.component';
import { ViewWatchlistComponent } from './components/watchlists/view-watchlist/view-watchlist.component';
import { EditWatchlistComponent } from './components/watchlists/edit-watchlist/edit-watchlist.component';
import { HistoricalViewWatchlistComponent } from './components/watchlists/historical-view-watchlist/historical-view-watchlist.component';
import { DeleteWatchlistComponent } from './components/watchlists/delete-watchlist/delete-watchlist.component';
import { SymbolFilterPipe } from './components/shared/pipes/symbol-filter.pipe';
import { TextFilterPipe } from './components/shared/pipes/text-filter.pipe';
import { ProcessChainFilter } from './components/shared/pipes/process-chain-filter.pipe';
import { MathOperationPipe } from './components/shared/pipes/math-op.pipe';
import { NgbdTypeaheadAlc } from './components/watchlists/typeahead-alc/typeahead-alc.component';
import { AlcNgbHighlight } from './components/watchlists/highlight-alc/highlight-alc.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MdSortModule } from '@angular/material';

export const sharedConfig: NgModule = {
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        CounterComponent,
        FetchDataComponent,
        SocialLoginComponent,
        WatchlistsComponent,
        ViewWatchlistComponent,
        HistoricalViewWatchlistComponent,
        EditWatchlistComponent,
        DeleteWatchlistComponent,
        SymbolFilterPipe,
        TextFilterPipe,
        ProcessChainFilter,
        MathOperationPipe,
        NgbdTypeaheadAlc,
        AlcNgbHighlight
    ],
    imports: [
        FormsModule,
        MdSortModule,
        StoreModule.provideStore(stocksAppReducer),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        NgbModule.forRoot(),
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'Home/Index/:id', component: HomeComponent },
            { path: 'api/Account/Login/:returnUrl', component: SocialLoginComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            {
                path: 'watchlists',
                component: WatchlistsComponent
            },
            {
                path: 'delete',
                component: DeleteWatchlistComponent
            },
            {
                path: 'login', component: SocialLoginComponent
            }
            //,
            //{ path: '**', redirectTo: 'home' }
        ],
            { enableTracing: true })
    ]
};
