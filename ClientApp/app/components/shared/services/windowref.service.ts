import { Injectable } from '@angular/core';
function _window(): any {
    // return the global native browser window object
    if (typeof(window) === 'undefined')
    {
        console.log("windowref: window undefined")
        return null;
    }
    else
    {
        return window;
    }
}
@Injectable()
export class WindowRef {
    get nativeWindow(): any {
        return _window();
    }
}