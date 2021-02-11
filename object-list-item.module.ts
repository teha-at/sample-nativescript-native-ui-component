import {registerElement} from '@nativescript/angular';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {ObjectListItemDirectives} from "./object-list-item.directives";
import {ObjectListItem} from "./object-list-item";

@NgModule({
    imports: [],
    declarations: [
        ObjectListItemDirectives,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    exports: [
        ObjectListItemDirectives,
    ],
    entryComponents: [],
})
export class ObjectListItemModule {
}

registerElement('ObjectListItem', () => ObjectListItem);
