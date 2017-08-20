import { Pipe, PipeTransform } from '@angular/core';
import { IPipeModel } from "./pipe-spec-interface.model";

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'processChainFilter'
})
export class ProcessChainFilter implements PipeTransform {
    public transform(value: any, pipes: IPipeModel[]) {
        if (typeof pipes === "undefined") return value;
        return pipes.reduce<any>((previous: any, current: IPipeModel, currentIndex: number, arrary: IPipeModel[]) => {
            return current.pipe.transform(previous, current.args);
        }, value);

    }
}
