import {isIOS, Property, View} from '@nativescript/core';
import {isNumber} from '@nativescript/core/utils/types';
import {ObjectModel} from "./object.model";

export const itemProperty = new Property<ObjectListItemBase, string>({
    name: 'item',
    defaultValue: null,
    affectsLayout: isIOS,
});


export abstract class ObjectListItemBase extends View {
    item: ObjectModel;

    hexToUIColor(str) {
        if (isNumber(str)) return str;
        let hex = /^#?([\da-fA-F]+)$/.exec(str)[1];

        if (hex.length === 3) {
            hex = hex.replace(/([a-zA-Z0-9])/g, '$1$1');
        }

        let n = parseInt(hex, 16);

        return UIColor.alloc().initWithRedGreenBlueAlpha(((n & 0xFF0000) >> 16) / 255.0, ((n & 0xFF00) >> 8) / 255.0, (n & 0xFF) / 255.0, 1);
    }

}

// defines 'item' property on the ObjectListItemBase class
itemProperty.register(ObjectListItemBase);

// If set to true - nativeView will be kept in memory and reused when some other instance
// of type MyButtonBase needs nativeView. Set to true only if you are sure that you can reset the
// nativeView to its initial state. When true will improve application performance.
ObjectListItemBase.prototype.recycleNativeView = 'auto';

export const enum Counter {
    P1 = 'P1',
    P2 = 'P2',
    P3 = 'P3',
    P4 = 'P4',
    P5 = 'P5',
    P6 = 'P6',
    P7 = 'P7',
    P8 = 'P8',
    T = 'T',
    M = 'M',
}

export const CounterP1 = {color: '#cc0000', icon: '\u{f0f3}', type: Counter.P1};
export const CounterP2 = {color: '#df6b35', icon: '\u{f0e7}', type: Counter.P2};
export const CounterP3 = {color: '#ca912b', icon: '\u{f071}', type: Counter.P3};
export const CounterP4 = {color: '#aaaa63', icon: '\u{f06a}', type: Counter.P4};
export const CounterP5 = {color: '#69aa63', icon: '\u{f129}', type: Counter.P5};
export const CounterP6 = {color: '#63aa90', icon: '\u{f129}', type: Counter.P6};
export const CounterP7 = {color: '#638eaa', icon: '\u{f129}', type: Counter.P7};
export const CounterP8 = {color: '#636caa', icon: '\u{f129}', type: Counter.P8};
export const CounterT = {color: '#cccccc', icon: '\u{f3ff}', type: Counter.T};
export const CounterM = {color: '#cccccc', icon: '\u{f0ad}', type: Counter.M};
