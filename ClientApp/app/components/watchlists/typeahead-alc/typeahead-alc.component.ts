import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { WatchlistDataService } from "../../shared/services/watchlist-data.service";
import { IASXListedCompany } from "../../core/models/asxlisted-company-interface.model";

@Component({
    selector: 'ngbd-typeahead-alc',
    templateUrl: './typeahead-alc.component.html',
    styleUrls: ['./typeahead-alc.component.css']
})
export class NgbdTypeaheadAlc {
    public model: any;
    public _stockName: string;
    searching = false;
    searchFailed = false;

    @Input()
    set resetStockName(stockName: string) {
        if (stockName != this.stockName)
        {
            this.stockName = stockName;
            this.model = stockName;
        }
    }

    set stockName(stockName: string) {
        this.newStockName(stockName);
    }

    OnModelChange(model: any) {
            switch (typeof model)
            {
                case 'string':
                    this.newStockName(model);
                    break;
                case 'object':
                    if ("code" in model)
                    this.newStockName((model as IASXListedCompany).code);
                    break;
            }
        this.model = model;
    }

    get stockName(): string { return this._stockName; }

    @Output() onNewStockName = new EventEmitter<string>();

 
    newStockName(stockName: string) {
        this.onNewStockName.emit(stockName);
        this._stockName = stockName;
    }
    

    constructor(private wService: WatchlistDataService) {
    }
    
    //search = (text$: Observable<string>) =>
    //    text$
    //        .debounceTime(200)
    //        .map(term => term === '' ? []
    //            : this.wService.findASXStocks(term, 4));

    search = (text$: Observable<string>) =>
        text$
            .debounceTime(300)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.wService.findASXStocks(term, 4)
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    }))
            .do(() => this.searching = false);

    formatter = this.formatSymbol;

    formatSymbol(codeObject: any)
    {
        switch (typeof codeObject) {
            case 'object':
                if ("code" in codeObject)
                    return codeObject.code;
                break;
            default:
                return codeObject;
        }
    }

    itemSelected($event) {
        //alert($event.item.name);
        //this.newStockName($event.item.code);
        console.log("NgbdTypeaheadAlc.itemSelected $event.item.name=" + $event.item.name + " ,model=" + this.stockName);
    }
}
