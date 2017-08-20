import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { PageEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { WatchlistDataService } from "../../shared/services/watchlist-data.service";
import { IASXListedCompany } from "../../core/models/asxlisted-company-interface.model";

@Component({
    selector: 'dialog-findalcstock',
    templateUrl: 'dialog-find-alc.component.html',
    styleUrls: ['./dialog-find-alc.component.less']
})
export class FindAlcStockDialog implements OnInit {
    stockCodeName: string;
    pageSize: number = 5;
    searching = false;
    searchFailed = false;
    data: IASXListedCompany[] = [];
    pageData: IASXListedCompany[] = [];

    stockFilterBy: Subject<string>;

    // MdPaginator Inputs
    get length(): number {
        if (this.data)
        {
            return this.data.length;
        }
        else {
            return 0;
        }
    }
    pageSizeOptions = [5, 10, 25, 100];

    currentPageIndex: number = 1;

    constructor(public dialogRef: MdDialogRef<FindAlcStockDialog>, private wService: WatchlistDataService) { }

    public ngOnInit(): void {
        this.stockFilterBy = new Subject<string>();
        this.search(
            this.stockFilterBy
        ).subscribe(result => {
            this.data = result;
            this.currentPageIndex = 0;
            this.showPage();

        });
    }

    public findASXStock(stockCodeName: string) {
        this.stockFilterBy.next(stockCodeName);
    }

    search = (text$: Observable<string>) =>
        text$
            .skipWhile((value, index) => {
                if (value)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            })
            .debounceTime(300)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.wService.findASXStocks(term, 0)
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of<IASXListedCompany[]>([]);
                    }))
            .do(() => this.searching = false);

    public sortBy(columnName: string) {

    }

    public applyArrowClass(columnName: string) {

    }

    public cancel() {

    }

    public save(stockCodeName: string)
    {
        this.dialogRef.close(stockCodeName);
    }

    public selectStock(column: MouseEvent) {
        if (column.currentTarget instanceof HTMLTableRowElement)
        {
            let rowIndex: number = (column.currentTarget as HTMLTableRowElement).rowIndex;
            let company: IASXListedCompany = this.pageData[rowIndex-1];
            this.stockCodeName = company.code;
        }
    }

    public showPage()
    {
        let start: number = this.currentPageIndex * this.pageSize;
        let end: number = Math.min(this.length, start + this.pageSize);
        this.pageData = this.data.slice(start, end);
    }

    public onPageEvent(pageEvent: PageEvent)
    {
        this.currentPageIndex = pageEvent.pageIndex;
        this.pageSize = pageEvent.pageSize;
        this.showPage();
    }
}
