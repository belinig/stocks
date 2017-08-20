import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UtilityService } from '../services/utility.service';

@Component({
    selector: 'current-datetime',
    template: `{{datetime}}`
})
export class CurrentDateTimeComponent implements OnInit, OnDestroy{
    private datetime: string;
    @Input() public delay: number;
    private subscription: Subscription;

    constructor(private util: UtilityService)
    {

    }

    public ngOnInit(): void {
        // default to the first available option
        this.datetime = this.util.getDateTimeString;

        this.subscription = Observable.interval(this.delay).subscribe(() => {
            this.datetime = this.util.getDateTimeString;
            console.log("CurrentDateTimeComponent=" + this.datetime + ",delay=" + this.delay);
        });
    }

    public ngOnDestroy(): void {
        // default to the first available option
        if (this.subscription)
            this.subscription.unsubscribe();
    }
}
