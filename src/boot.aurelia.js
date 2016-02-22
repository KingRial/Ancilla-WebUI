"use strict";

import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';

LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.logLevel.debug);

export function configure(aurelia) {
  aurelia.use
    .defaultBindingLanguage()
    .defaultResources()
    .history()
    .router()
    .eventAggregator()
    //.globalResources('ancilla:aurelia.customkeypressed')
    .plugin('aurelia-breeze')
    .plugin('aurelia-fetch-client')
  ;
  aurelia.start().then(() => aurelia.setRoot('App', document.body));
}
