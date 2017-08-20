import { Component } from '@angular/core';

@Component({
    selector: 'watchlists',
    templateUrl: './watchlists.component.html'
})
export class WatchlistsComponent {
    public currentCount = 0;

    public onWatchSelected() {
        this.currentCount++;
    }

    public onEditSelected() {
        this.currentCount++;
    }
}



