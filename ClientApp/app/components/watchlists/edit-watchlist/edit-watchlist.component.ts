import { Component, OnInit, Input } from '@angular/core';
import { IWatchlist } from "../../core/models/watchlist-interface.model";
import { IStock } from "../../core/models/stock-interface.model";
import { IId } from "../../core/models/id-number-interface.model";
import { WatchlistDataService } from "../../shared/services/watchlist-data.service";
import { UtilityService } from "../../shared/services/utility.service";
import { MdDialog, MdDialogRef } from '@angular/material';
import { FindAlcStockDialog } from '../dialog-find-alc/dialog-find-alc.component'


@Component({
    selector: 'edit-watchlist',
    templateUrl: './edit-watchlist.component.html',
    styleUrls: ['./edit-watchlist.component.css']
})
export class EditWatchlistComponent implements OnInit {
    @Input()
    public watchlists: IWatchlist[];

    public watchlist: IWatchlist;

    public newStockName: string | null;


    onNewStockName(newStockName: string) {
        this.newStockName = newStockName;
        console.log("EditWatchlistComponent - onNewStockName=" + newStockName);
    }

    addStock2WatchlistEdit(newStockName: string) {
        let maxId: number = this.findMaxId(this.watchlist.symbols);
        this.watchlist.symbols.push({ symbol: newStockName, exchangeAbbr: 'AX', id: ++maxId });
        this.newStockName = null;
    }

    @Input()
    public selectedWatchlistName: string | null;

    @Input()
    public watchlistNameEdit: string | null;

    @Input()
    public quotedate: string;

    @Input()
    public fontSize: number;

    private selectedWatchlist: any;
    public orderByStock: string;
    private filterBy: string;
    private notification: string;
    private csvImport: any;
  

    constructor(private wService: WatchlistDataService, private utils: UtilityService, public dialog: MdDialog) {
    }

    public ngOnInit(): void {
        // default to the first available option
        this.selectedWatchlistName = this.watchlists && this.watchlists.length > 0 ? this.watchlists[0].name : null;
        this.quotedate = new Date().toISOString().substring(0, 10);
        this.fontSize = 15;

        this.wService.getWatchlists.subscribe(result => {
            this.watchlists = result.map<IWatchlist>(value => { return { name: value } as IWatchlist });
            let wl: IWatchlist = this.watchlists && this.watchlists.length > 0 ? this.watchlists[0] : null;
            this.selectedWatchlistName = wl ? wl.name : null;
            if (wl) {
                this.changeWatchlist(wl);
            }
        });
    }

    get watchlistEditName() : string
    {
        if (this.watchlist)
            return this.watchlist.name
        else
            return "";
    }

    set watchlistEditName(value: string)
    {
        if (this.watchlist)
        {
            this.watchlist.name = value       
        }
    }

    public setSortOrder(order: string) {
        this.orderByStock = order;
    }

    public getFontSize(): number
    {
        return this.fontSize
    }

    public changeWatchlist(selectedWatchlist: IWatchlist) {
        console.log("EditWatchlistComponent - changeWatchlist=" + selectedWatchlist ? selectedWatchlist.name : null);
        this.selectedWatchlist = selectedWatchlist;
        this.selectedWatchlistName = this.selectedWatchlist ? this.selectedWatchlist.name : null;
        if (this.selectedWatchlist) {
            this.getWatchlist(this.selectedWatchlistName);
        }
    }

    public onSubmit() {
        console.log("EditWatchlistComponent - OnSubmit")
    }

    public changeQuotedate(quotedate:any) {
        console.log("EditWatchlistComponent - changeQuotedate=" + quotedate)
        this.quotedate = quotedate;
    }  

    public changeFontSize(fontSize: number) {
        console.log("EditWatchlistComponent - changeFontSize=" + fontSize)
        this.fontSize = fontSize;
    }    

    public getWatchlist(watchlistName: string) {
        console.log("EditWatchlistComponent - watchlistName")
        this.wService.getWatchlist(watchlistName).subscribe(result => {
            this.watchlist = result ? result.watchlist : null;
            if (this.watchlist)
            {
                let index: number = 0;
                this.watchlist.symbols.forEach(value => { value.id = index++; });
                //let symbols: IStock[] = this.watchlist.symbols.sort((a, b) => { return a.symbol.localeCompare(b.symbol) });
            }
        });;
    }

    public newWatchlistEdit() {
        console.log("EditWatchlistComponent - newWatchlistEdit=");
        this.watchlist = {};
        this.watchlist.name = "NewWatchlist";
    }

    public cancelWatchlistEdit() {
        console.log("EditWatchlistComponent - cancelWatchlistEdit=");
    }

    public saveWatchlistEdit() {
        console.log("EditWatchlistComponent - saveWatchlistEdit=");
        if (this.watchlist) {
            try {
                this.wService.saveWatchlist(this.watchlist)
                    .subscribe(result => {
                        if (result)
                            this.notification = "Watchlist saved successfully: " + this.watchlist.name;
                        else
                            this.notification = "Failed to save watchlist: " + this.watchlist.name;
                    },
                    error => this.notification = <any>error);
            }
            catch (ex)
            {
                this.notification = ex as string;
            }
        }
    }

    public removeStockFromWatchlistEdit(stock: IStock) {
        console.log("EditWatchlistComponent - removeStockFromWatchlistEdit=" + stock.symbol);
    }

    private files: any;

    public OnChangeFileInput(event)
    {
        this.files = event.srcElement.files;
    }

    public importWatchlistEdit(stock: IStock) {
        console.log("EditWatchlistComponent - importWatchlistEdit=");
        console.log("importWatchlistEdit");
        var modified = true;
        var file = this.files[0];
        var reader = new FileReader();
        let that: EditWatchlistComponent = this; 

        reader.onload = function (loadEvent) {
            var text = reader.result;
            that.csvImport = that.utils.csvToObj(text);
            that.notification = file.name + " red successfully; processing";
            if (that.csvImport != null && that.csvImport.length > 0) {
                that.ShowImport(that.csvImport[0]["Name"]);
            }
        }
        reader.onerror = function (this, err: ErrorEvent) {
            console.log(err, err.error
                , err.message
                , file.Name);
            that.notification = "Failed to import file:" + file.Name + ":" + err;
        }

        that.notification = "Processing File";
        reader.readAsText(file);
    }

    public ShowImport = function (watchlistName: string) {
        console.log("ShowImport watchlist:" + watchlistName);
        if (this.csvImport == null) {
            console.log("csvImport empty");
            return;
        }
        let watchlist: IWatchlist = {};
        watchlist.name = watchlistName;
        watchlist.symbols = [];
        for (let i: number = 0; i < this.csvImport.length; i++) {

            if (watchlistName != this.csvImport[i]["Name"]) {
                continue;
            }
            let stock: IStock = {
                id: i,
                symbol: this.csvImport[i]["Code"],
                exchangeAbbr: "AX"
            }
            watchlist.symbols.push(stock);
        }

        console.log("ShowImport end, items parsed count=" + watchlist ? watchlist.symbols.length:0);
        this.watchlist = watchlist;
     };

    public findMaxId (ids: IId[]) : number
    {
        if (!ids) return -1;
        return ids.reduce((prev, cur) => {
            if (prev && prev.id < cur.id) return prev;
            else return cur;
        }).id;
    
    }

    public searchStockCode(event) {
        let dialogRef = this.dialog.open(FindAlcStockDialog,
            {
                width: '600px',
                panelClass: "panelFindAlcStockDialog"
            });
        dialogRef.afterClosed().subscribe(result => {
            this.newStockName = result;
        });
    }
}


