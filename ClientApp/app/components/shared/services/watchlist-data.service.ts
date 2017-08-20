import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IWatchlistQuote } from "../../core/models/watchlist-quote-interface.model";
import { IASXListedCompany } from "../../core/models/asxlisted-company-interface.model";
import { IWatchlist } from "../../core/models/watchlist-interface.model";
import { UtilityService } from "./utility.service";


@Injectable()
export class WatchlistDataService {

    constructor(private http: Http, @Inject('ORIGIN_URL') private originUrl: string,
        private utils: UtilityService) {
    };

    get getWatchlists(): Observable<string[]> {
        return this.http.get(this.originUrl + '/api/QuoteApi/Watchlists/Get')
            .map(result => result.json() as string[])
            .catch(error => {
                // TODO: add real error handling
                console.error("Error in getWatchlist:" + error);
                return Observable.of<string[]>([]);
            })
            ;
    }

    public getWatchlist(watchlistName: string): Observable<IWatchlistQuote> {
        return this.http.get(this.originUrl + '/api/QuoteApi/Watchlist/Current/' + watchlistName)
            .map(result => result.json() as IWatchlistQuote)
            .catch(error => {
                // TODO: add real error handling
                console.error("Error in getWatchlist:" + error);
                return Observable.of<IWatchlistQuote>();
            })
            ;
    }

    public getWatchlistHistoricalData(watchlistName: string, date: Date): Observable<IWatchlistQuote> {
        return this.http.get(this.originUrl + '/api/QuoteApi/Watchlist/Historical/' + watchlistName + '/' + this.utils.formatDateOnlyString(date))
            .map(result => result.json() as IWatchlistQuote)
            .catch(error => {
                // TODO: add real error handling
                console.error("Error in getWatchlistHistoricalData:" + error);
                return Observable.of<IWatchlistQuote>();
            })
            ;
    }

    public findASXStocks(match: string, top: number = 4): Observable<IASXListedCompany[]> {
        return this.http.get(this.originUrl + '/api/QuoteApi/ASXStocks/Find/' + match + "/" + top)
            .map(result => {
                            let body = result.json();
                            return <IASXListedCompany[]>(body || []);
                           }
                )
            .catch(error => {
                // TODO: add real error handling
                console.error("Error in findASXStocks:" + error);
                return Observable.of<IASXListedCompany[]>([]);
            })
            ;
    }

    public saveWatchlist(watchlist: IWatchlist): Observable<Response> {

        //var watchlistselected = Watchlist.getWatchlist(Watchlist.getSelectedWatchlistName());
        //var watchlist = {};
        //watchlist.Id = watchlistselected.id;
        //watchlist.Name = watchlistselected.name;
        //watchlist.Symbols = [];
        //for (let stock of watchlistselected.stocks) {
        //    if (!stock.removed) {
        //        watchlist.Symbols.push(stock.symbol);
        //    }
        //};
        let headers = new Headers({ 'Content-Type': 'application/json', 'dataType': 'json' });
        let options = new RequestOptions({ headers: headers });


        return this.http.post(this.originUrl + '/api/QuoteApi/Watchlist/Save', JSON.stringify(watchlist), options)
            .map(result => result.json())
            .catch(error => {
                return this.handleErrorObservable(error);
            })
            ;
    }


    public deleteWatchlist(watchlistId: string): Observable<Response> {

        let headers = new Headers({ 'Content-Type': 'application/json', 'dataType': 'json' });
        let options = new RequestOptions({ headers: headers });


        return this.http.delete(this.originUrl + '/api/QuoteApi/Watchlist/Delete/' + watchlistId,  options)
            .map(result => result.json())
            .catch(error => {
                return this.handleErrorObservable(error);
            })
            ;
    }


    private handleErrorObservable(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }

    private extractPostData(res: Response) {
        let body = res.json();
        return body.data || {};
    }

   
}