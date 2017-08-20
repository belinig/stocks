import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { sharedConfig } from './app.module.shared';
import { WindowRef } from './components/shared/services/windowref.service';
import { UtilityService } from './components/shared/services/utility.service';
import { WatchlistDataService } from './components/shared/services/watchlist-data.service';
import { UserActions } from './components/shared/store/profile/user.actions';
import { MdTabsModule, MdDialogModule, MdPaginatorModule, MdProgressSpinnerModule } from '@angular/material';

//import { MdTabsModule } from 'md-tabs/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrentDateTimeComponent } from './components/shared/directives/current-datetime.directive';
import { FindAlcStockDialog } from './components/watchlists/dialog-find-alc/dialog-find-alc.component';



@NgModule({
    bootstrap: sharedConfig.bootstrap,
    declarations:
    [
        CurrentDateTimeComponent,
        FindAlcStockDialog,
        ...sharedConfig.declarations
     ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        MdTabsModule,
        MdDialogModule,
        MdPaginatorModule,
        MdProgressSpinnerModule,
        ...sharedConfig.imports
    ],
    entryComponents: [
        FindAlcStockDialog
    ],
    exports: [
        FormsModule
    ],
     providers: [
        WindowRef,
        UserActions,
        UtilityService,
        WatchlistDataService,
        { provide: 'ORIGIN_URL', useValue: location.origin },
    ],
     schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
