import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe, DatePipe, PercentPipe } from '@angular/common';
import { IWatchlist } from "../../core/models/watchlist-interface.model";
import { IWatchlistQuote } from "../../core/models/watchlist-quote-interface.model";
import { IQuote } from "../../core/models/quote-interface.model";
import { IStock } from "../../core/models/stock-interface.model";
import { IId } from "../../core/models/id-number-interface.model";
import { WatchlistDataService } from "../../shared/services/watchlist-data.service";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Sort, MdSortHeaderIntl, MdSort, MdSortHeader } from '@angular/material';
import { ProcessChainFilter } from "../../shared/pipes/process-chain-filter.pipe";
import { MathOperationPipe } from "../../shared/pipes/math-op.pipe";
import { IPipeModel } from "../../shared/pipes/pipe-spec-interface.model";
import { Observable } from 'rxjs/Rx';


@Component({
    selector: 'view-watchlist',
    templateUrl: './view-watchlist.component.html',
    styleUrls: ['./view-watchlist.component.css'],
    providers: [MdSortHeaderIntl]
})
export class ViewWatchlistComponent implements OnInit {
    public ready: boolean = false;

    @Input()
    public watchlists: string[];

    readonly pipes = {
        number: new DecimalPipe("en-AU"),
        date: new DatePipe("en-AU"),
        mathOp: new MathOperationPipe(),
        percent: new PercentPipe("en-AU")
    };

    readonly amountFilter: IPipeModel[] = [<IPipeModel>{
        pipe: this.pipes.number, args: "1.2-3"
    }];
    readonly dateFilter: IPipeModel[] = [<IPipeModel>{
        pipe: this.pipes.date, args: ['dd-MM-yyyy HH:mm:ss']
    }];
    readonly percentFilter: IPipeModel[] = [
        <IPipeModel>{
            pipe: this.pipes.mathOp, args: ['/', '100']
        },
        <IPipeModel>{
            pipe: this.pipes.percent, args: '1.2-5'
        }
    ];

    public getTradingDirectionSymbol(item: any)
    {
        if (+item.change > 0) return "&#9650;";
        else if (+item.change < 0) return "&#9660;";
        else return "&#9724;";
    }

    public getTradingDirectionColor(item: any) {
        if (+item.change > 0) return "green";
        else if (+item.change < 0) return "red";
        else return "black";
    }

    public getTradingColor(column: any, item: any)
    {
        if (!('tradingColor' in column) || !column['tradingColor']) return "black";
        if (+item[column.prop] > 0) return "green";
        else if (+item[column.prop] < 0) return "red";
        else return "black";
    }

    public columns: any[] = [
        { name: "Bid($)", prop: "bid", align: "right", filter: this.amountFilter },
        { name: "Ask($)", prop: "ask", align: "right", filter: this.amountFilter },
        {name: "Price($)", prop: "lastTradePrice", align: "right", filter: this.amountFilter },
        {name: "Update Date", prop: "lastUpdate", align: "right", filter: this.dateFilter},
        { name: "Change($)", prop: "change", align: "right", tradingColor: true, filter: [<IPipeModel>{pipe: this.pipes.number}]},
        { name: "(%)", prop: "changeInPercent", align: "right", tradingColor: true, filter: this.percentFilter },
        { name: "Open($)", prop: "open", align: "right", filter: this.amountFilter },
        { name: "High($)", prop: "dailyHigh", align: "right", filter: this.amountFilter },
        { name: "Low($)", prop: "dailyLow", align: "right", filter: this.amountFilter },
        {name: "Volume", prop: "volume", align: "right", filter: [<IPipeModel>{ pipe: this.pipes.number }] },
        {name: "Last Trade Date", prop: "lastTradeDate", align: "right", filter: this.dateFilter },
        {name: "Previous Close($)", prop: "previousClose", align: "right", filter: this.amountFilter }
    ];


    public watchlist: IWatchlistQuote;
    progressColor: string = "primary";
    stopSpinner: boolean =  false;

    @Input()
    public selectedWatchlistName: string | null;

    @Input()
    public initWatchlistName: string | null;

    @Input()
    public quotedate: string;

    @Input()
    public fontSize: number;

    public selectedWatchlist: any;
    public orderByStock: string;
    public filterBy: string;

    @ViewChild(MdSort) sort: MdSort;
    @ViewChildren(MdSortHeader) sortHeader: QueryList<MdSortHeader>;
    @ViewChild("open") sortHeaderOpen: MdSortHeader;
    @ViewChild("previousClose") sortHeaderPreviousClose: MdSortHeader;
    
    constructor(public wService: WatchlistDataService,
        public router: Router,
        public route: ActivatedRoute,
        private sordHeaderIntl: MdSortHeaderIntl) {
        sordHeaderIntl.sortButtonLabel = (id) => { return "override label for stocks for " + id };
    }

    public ngOnInit(): void {
        // default to the first available option
        this.selectedWatchlistName = this.watchlists ? this.watchlists[0] : null;
        this.initWatchlistName = this.route.snapshot.paramMap.get('wname');
        this.quotedate = new Date().toISOString().substring(0, 10);
        this.fontSize = 15;

        this.stopSpinner = false;


        this.wService.getWatchlists.subscribe(result => {
            this.ready = true;
            this.watchlists = result;
            this.selectedWatchlistName = null;
            if (this.watchlists)
            {
                if (this.initWatchlistName && this.watchlists.indexOf(this.initWatchlistName) != -1)
                {
                    this.selectedWatchlistName = this.initWatchlistName
                }
                else
                {
                    this.selectedWatchlistName = this.watchlists[0];
                }
            }

            if (!this.selectedWatchlistName)
            {
                this.stopSpinner = true;
            }

            this.changeWatchlist(this.selectedWatchlistName);

        });
    }

    public setSortOrder(order: string) {
        this.orderByStock = order;
    }

    public getFontSize(): number
    {
        return this.fontSize
    }

    public changeWatchlist(selectedWatchlist: any) {
        console.log("ViewWatchlistComponent - changeWatchlist=" + selectedWatchlist)
        this.selectedWatchlistName = selectedWatchlist;
        this.getWatchlist(this.selectedWatchlistName);
    }

    public onSubmit() {
        console.log("ViewWatchlistComponent - OnSubmit")
    }

    public changeQuotedate(quotedate:any) {
        console.log("ViewWatchlistComponent - changeQuotedate=" + quotedate)
        this.quotedate = quotedate;
    }  

    public changeFontSize(fontSize: number) {
        console.log("ViewWatchlistComponent - changeFontSize=" + fontSize)
        this.fontSize = fontSize;
    }    

    public getWatchlist(watchlistName: string) {
        console.log("ViewWatchlistComponent - watchlistName")
        this.stopSpinner = false;
        this.wService.getWatchlist(watchlistName).subscribe(result => {
            this.stopSpinner = true;
            if (this.selectedWatchlistName == result.watchlist.name) {
                this.watchlist = result;
                let index: number = 0;
                this.watchlist.watchlist.symbols.forEach(value => { value.id = index++; });
                let symbols: IStock[] = this.watchlist.watchlist.symbols.sort((a, b) => { return a.symbol.localeCompare(b.symbol) });
                let quotes: IQuote[] = this.watchlist.quotes.sort((a, b) => { return a.symbol.localeCompare(b.symbol) });
                symbols.forEach((value, index) => {
                    if (value.symbol + "." + value.exchangeAbbr === quotes[index].symbol) {
                        quotes[index].id = value.id;
                    }
                    else {
                        quotes.unshift({ id: value.id, symbol: value.symbol + "." + value.exchangeAbbr } as IQuote);
                    }
                });

                this.watchlist.quotes = quotes.sort((a, b) => { return this.compare(a.id, b.id, true) });

            }
        });
    }

    public OnDeleteWatchlist(watchlistName: string) {
        console.log("ViewWatchlistComponent - OnDeleteWatchlist, watchlistname=" + watchlistName);
        if (watchlistName && this.watchlist && this.watchlist.watchlist && watchlistName == this.watchlist.watchlist.name &&  this.watchlist.watchlist.id)
        {
            this.router.navigate(['delete', { wname: watchlistName, wid: this.watchlist.watchlist.id }]);
        }

    }

    public OnEditWatchlist(watchlistName: string) {
        console.log("ViewWatchlistComponent - OnEditWatchlist, watchlistname=" + watchlistName);
    }

    sortData(sort: Sort) {
        const data = this.watchlist.quotes.slice();
        let isAsc = sort.direction == 'asc';
        let sortName = sort.active;
        if (!sort.active || sort.direction == '') {
            sortName = "id";
            isAsc = true;
        }

        this.watchlist.quotes = data.sort((a, b) => {
            if (a == null && b == null) return 0;
            if (a == null) return -1;
            if (b == null) return 1;
            if (!(sortName in a && sortName in b)) return 0;
            if (!(sortName in a)) return -1;
            if (!(sortName in b)) return 1;

            return this.compare(a[sortName], b[sortName], isAsc);

        });
    }


    public compare(a, b, isAsc) {
        if (a == b) return 0;
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
    
    
}


