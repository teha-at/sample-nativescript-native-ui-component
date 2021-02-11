import {Property, View} from '@nativescript/core';
import {ObjectModel} from "./object.model";

export class ObjectListItem extends View {
    item: ObjectModel;
}

export const itemProperty: Property<ObjectListItem, string>;
