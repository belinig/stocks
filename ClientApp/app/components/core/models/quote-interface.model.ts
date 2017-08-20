import { IStock } from "./stock-interface.model";

export interface IQuote extends IStock
{

    lastTradePrice: number;
    lastUpdate: Date;

    volume: number | null;
    changeInPercent: number | null;
    previousClose: number | null;
    open: number | null;
    dailyHigh: number | null;
    dailyLow: number | null;
    lastTradeDate: Date | null;
    change: number | null;
    changePercent: number | null;
    ask: number | null;
    bid: number | null; 
}

export interface IQuoteCurrent extends IQuote {

    lastTradePrice: number;
    lastUpdate: Date;

    volume: number | null;
    changeInPercent: number | null;
    previousClose: number | null;
    open: number | null;
    dailyHigh: number | null;
    dailyLow: number | null;
    lastTradeDate: Date | null;
    change: number | null;
    changePercent: number | null;
    ask: number | null;
    bid: number | null;
}


export interface IQuoteHistorical extends IQuote {

    lastTradePrice: number;
    lastUpdate: Date;

    volume: number | null;
    changeInPercent: number | null;
    previousClose: number | null;
    open: number | null;
    dailyHigh: number | null;
    dailyLow: number | null;
    lastTradeDate: Date | null;
    change: number | null;
    changePercent: number | null;
    ask: number | null;
    bid: number | null;
}
