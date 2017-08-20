import { IStock } from "./stock-interface.model";

export interface IWatchlist
{
    id?: string | null;
    name?: string | null;
    symbols?: IStock[] | null;
}
