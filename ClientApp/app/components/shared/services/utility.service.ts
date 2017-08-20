import { Injectable } from '@angular/core';

@Injectable()
export class UtilityService {
    get getDateTimeString(): string {
        var date : Date = new Date();
        var secs : number = date.getSeconds();
        var mins: number = date.getMinutes();
        var sSecs: string = secs.toString();
        var sMins: string = mins.toString();
        if (secs < 10) { sSecs = "0" + sSecs };
        if (mins < 10) { sMins = "0" + sMins };
        var datestring = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() +
            " - " + date.getHours() + ":" + sMins + ":" + sSecs;
        return datestring;
    }

    get getDateString(): string {
        var date = new Date();
        var datestring = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        return datestring;
    }

    formatDateOnlyString(dateonly: Date): string {
        let month: number = dateonly.getMonth() + 1;
        let dt: number = dateonly.getDate();
        let sMonth: string = month.toString();
        let sDt: string = dt.toString();
        if (month < 10) { sMonth = "0" + sMonth };
        if (dt < 10) { sDt = "0" + sDt };
        var datestring = dateonly.getFullYear() + sMonth + sDt;
        return datestring;
    }


    public csvToObj(csv: string): any {
        var rows = csv.split('\n');
        var obj = [];
        var header = [];
        var counter = 0;
        rows.forEach(val => {
            var o = val.split(',');
            counter++;
            if (counter === 1) {
                for (let i: number = 0; i < o.length; i++) {
                    header[i] =  o[i].replace("($)", "Dollar").replace("(%)", "Percentage").replace(/\s/g, '');
                }
            }
            else {

                var row = {};
                for (let i: number = 0; i < o.length; i++) {
                    row[header[i]] = o[i];
                }
                obj.push(row);
            }

        });
        return obj;
    };
}