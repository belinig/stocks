import { Pipe, PipeTransform } from '@angular/core';

export interface IPipeModel {
    pipe: PipeTransform;
    args?: any[]|any|null;
}
