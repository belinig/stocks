import { Pipe, PipeTransform } from '@angular/core';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'mathOp'
})
export class MathOperationPipe implements PipeTransform {
    public transform(value: string, args: string[]) {
        if (typeof args === "undefined") throw "Exception: operation required";
        let op: string = args[0];
        let right: string;
        if (args.length > 1) right = args[1];
        switch (op) {
            case "+": return +value + +right;
            case "-": return +value - +right;
            case "/": return +value / +right;
            case "%": return +value % +right;
            default:
                if (op in Math) {
                    return Math[op](value);
                }
                else throw "Invalid operation:" + op;
        }
    }
}

