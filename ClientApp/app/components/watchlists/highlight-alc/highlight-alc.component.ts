import { Component, Input, OnChanges, AfterContentInit, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap/typeahead/highlight';
import { regExpEscape, toString } from '@ng-bootstrap/ng-bootstrap/util/util';


@Component({
    selector: 'alc-ngb-highlight',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './highlight-alc.component.html',
    styleUrls: ['./highlight-alc.component.css']
})
export class AlcNgbHighlight extends NgbHighlight implements OnChanges, AfterContentInit {
    parts: string[];

    @Input()
    prop: string;

    @Input('result')
    resultAlc: Object;

    @Input() highlightClass = 'alc-ngb-highlight';

    ngAfterContentInit()
    {
        console.log("AlcNgbHighlight - ngAfterContentInit" + ",prop=" + this.prop);

        this.result = this.resultAlc[this.prop];
        console.log("AlcNgbHighlight - ngAfterContentInit" + ",result=" + this.result + ",term=" + this.term);

    }

    //ngOnChanges(changes: SimpleChanges) {
    //    super.ngOnChanges(changes);
    //    //this.parts = ["F", "A", "R"];
    //    console.log("AlcNgbHighlight - ngOnChanges" + ",parts=" + JSON.stringify(this.parts));

    //}

    ngOnChanges(changes: SimpleChanges) {
        if (this.resultAlc && this.prop)
        {
            this.result = this.resultAlc[this.prop];
        }

        const resultStr = toString(this.result);
        const resultLC = resultStr.toLowerCase();
        const termLC = toString(this.term).toLowerCase();
        let currentIdx = 0;

        if (termLC.length > 0) {
            this.parts = resultLC.split(new RegExp(`(${regExpEscape(termLC)})`)).map((part) => {
                const originalPart = resultStr.substr(currentIdx, part.length);
                currentIdx += part.length;
                return originalPart;
            });
        } else {
            this.parts = [resultStr];
        }
        console.log("AlcNgbHighlight - ngOnChanges" + ",parts=" + JSON.stringify(this.parts));
    }
}