import BigNumber from 'bignumber.js';
import {toValue} from "../../../../emit-wallet/src/utils";

var format = require('date-format');

export const utils = {
    ellipsisStr: function (v: string, num?: number) {
        if (!v) return ""
        if (!num) {
            num = 7
        }
        if (v.length >= 15) {
            return v.slice(0, num) + " ... " + v.slice(v.length - num, v.length);
        }
        return v
    },


    formatValueString: function (value: string | BigNumber | number | undefined, fix: number = 3): string {
        if (!value) {
            return "0.000"
        }
        return this.nFormatter(this.fromValue(value, 18), fix)
    },

    fromValue: function (value: string | BigNumber | number | undefined, decimal: number): BigNumber {
        if (!value) {
            return new BigNumber(0)
        }
        return new BigNumber(value).dividedBy(10 ** decimal)
    },

    toValue: function (value: string | BigNumber | number, decimal: number): BigNumber {
        if (!value) {
            return new BigNumber(0)
        }
        return new BigNumber(value).multipliedBy(10 ** decimal)
    },

    nFormatter: function (n: number | BigNumber | string | undefined, digits: number) {
        if (!n || new BigNumber(n).toNumber() == 0) {
            return "0.000"
        }
        const num = new BigNumber(n).toNumber();
        const si = [
            {value: 1, symbol: ""},
            {value: 1E3, symbol: "K"},
            {value: 1E6, symbol: "M"},
            {value: 1E9, symbol: "G"},
            {value: 1E12, symbol: "T"},
            {value: 1E15, symbol: "P"},
            {value: 1E18, symbol: "E"}
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    },
    toHex(value: string | number | BigNumber, decimal?: number) {
        if (value === "0x") {
            return "0x0"
        }
        if (decimal) {
            return "0x" + this.toValue(value, decimal).toString(16);
        }
        return "0x" + new BigNumber(value).toString(16)
    },

    dateFormat (date:Date){
        return format(format.ISO8601_WITH_TZ_OFFSET_FORMAT, date);
    },
}