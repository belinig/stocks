import { IWatchlist } from "./watchlist-interface.model";
import { IQuote } from "./quote-interface.model";


export interface IWatchlistQuote {
    watchlist: IWatchlist;
    quotes: IQuote[];
}
