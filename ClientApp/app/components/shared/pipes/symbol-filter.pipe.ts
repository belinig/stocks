import { Pipe, PipeTransform } from '@angular/core';
import { IStock } from "../../core/models/stock-interface.model";

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'symbolFilter'
})
export class SymbolFilterPipe implements PipeTransform {
    public transform(stocks: IStock[], filterBy: string) {
        if (filterBy) {
            return stocks.filter(stock => stock.symbol.includes(filterBy));
        }
        else {

            return stocks;
        }
    }
}
