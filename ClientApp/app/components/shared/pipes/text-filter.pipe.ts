import { Pipe, PipeTransform } from '@angular/core';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'textFilter'
})
export class TextFilterPipe implements PipeTransform {
    public transform(stocks: string[], filterBy: string) {
        if (filterBy) {
            return stocks.filter(stock => stock.includes(filterBy));
        }
        else {

            return stocks;
        }
    }
}
