"use strict";

import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';
import {Redirect} from 'aurelia-router';
import { default as Ancilla } from 'ancilla:Ancilla';

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
    //.plugin('aurelia-breeze')
    .plugin('aurelia-fetch-client')
  ;
  Ancilla.ready({
    fRedirect: Redirect
  })
    .then( () => aurelia.start() )
    .then(() => aurelia.setRoot('App', document.body))
  ;
}
