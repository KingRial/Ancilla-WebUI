System.config({
  "transpiler": "traceur",
  "paths": {
    "*": "*.js",
    "github:*": "libs/External/jspm_packages/github/*.js",
    "npm:*": "libs/External/jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "aurelia-animator-css": "github:aurelia/animator-css@0.3.2",
    "aurelia-bootstrapper": "github:aurelia/bootstrapper@0.13.1",
    "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.8.1",
    "aurelia-framework": "github:aurelia/framework@0.12.0",
    "aurelia-http-client": "github:aurelia/http-client@0.9.1",
    "aurelia-router": "github:aurelia/router@0.9.0",
    "bluebird": "github:petkaantonov/bluebird@2.9.33",
    "bootstrap": "github:twbs/bootstrap@3.3.5",
    "css": "github:systemjs/plugin-css@0.1.13",
    "forge": "github:digitalbazaar/forge@0.6.34",
    "jquery": "github:components/jquery@2.1.4",
    "jsplumb": "github:sporritt/jsplumb@1.7.5",
    "materialize": "github:Dogfalo/materialize@0.96.1",
    "traceur": "github:jmcriffey/bower-traceur@0.0.88",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.88",
    "github:Dogfalo/materialize@0.96.1": {
      "css": "github:systemjs/plugin-css@0.1.13",
      "jquery": "github:components/jquery@2.1.4"
    },
    "github:aurelia/animator-css@0.3.2": {
      "aurelia-templating": "github:aurelia/templating@0.12.1"
    },
    "github:aurelia/binding@0.7.3": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.8.1",
      "aurelia-metadata": "github:aurelia/metadata@0.6.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.5.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/bootstrapper@0.13.1": {
      "aurelia-event-aggregator": "github:aurelia/event-aggregator@0.5.0",
      "aurelia-framework": "github:aurelia/framework@0.12.0",
      "aurelia-history": "github:aurelia/history@0.5.0",
      "aurelia-history-browser": "github:aurelia/history-browser@0.5.0",
      "aurelia-loader-default": "github:aurelia/loader-default@0.8.0",
      "aurelia-logging-console": "github:aurelia/logging-console@0.5.0",
      "aurelia-router": "github:aurelia/router@0.9.0",
      "aurelia-templating": "github:aurelia/templating@0.12.1",
      "aurelia-templating-binding": "github:aurelia/templating-binding@0.12.0",
      "aurelia-templating-resources": "github:aurelia/templating-resources@0.12.1",
      "aurelia-templating-router": "github:aurelia/templating-router@0.13.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/dependency-injection@0.8.1": {
      "aurelia-logging": "github:aurelia/logging@0.5.0",
      "aurelia-metadata": "github:aurelia/metadata@0.6.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/event-aggregator@0.5.0": {
      "aurelia-logging": "github:aurelia/logging@0.5.0"
    },
    "github:aurelia/framework@0.12.0": {
      "aurelia-binding": "github:aurelia/binding@0.7.3",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.8.1",
      "aurelia-loader": "github:aurelia/loader@0.7.0",
      "aurelia-logging": "github:aurelia/logging@0.5.0",
      "aurelia-metadata": "github:aurelia/metadata@0.6.0",
      "aurelia-path": "github:aurelia/path@0.7.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.5.0",
      "aurelia-templating": "github:aurelia/templating@0.12.1",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/history-browser@0.5.0": {
      "aurelia-history": "github:aurelia/history@0.5.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/http-client@0.9.1": {
      "aurelia-path": "github:aurelia/path@0.7.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/loader-default@0.8.0": {
      "aurelia-loader": "github:aurelia/loader@0.7.0",
      "aurelia-metadata": "github:aurelia/metadata@0.6.0"
    },
    "github:aurelia/loader@0.7.0": {
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
      "aurelia-path": "github:aurelia/path@0.7.0",
      "core-js": "npm:core-js@0.9.18",
      "webcomponentsjs": "github:webcomponents/webcomponentsjs@0.6.3"
    },
    "github:aurelia/metadata@0.6.0": {
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/route-recognizer@0.5.0": {
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/router@0.9.0": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.8.1",
      "aurelia-event-aggregator": "github:aurelia/event-aggregator@0.5.0",
      "aurelia-history": "github:aurelia/history@0.5.0",
      "aurelia-path": "github:aurelia/path@0.7.0",
      "aurelia-route-recognizer": "github:aurelia/route-recognizer@0.5.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/templating-binding@0.12.0": {
      "aurelia-binding": "github:aurelia/binding@0.7.3",
      "aurelia-logging": "github:aurelia/logging@0.5.0",
      "aurelia-templating": "github:aurelia/templating@0.12.1"
    },
    "github:aurelia/templating-resources@0.12.1": {
      "aurelia-binding": "github:aurelia/binding@0.7.3",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.8.1",
      "aurelia-logging": "github:aurelia/logging@0.5.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.5.0",
      "aurelia-templating": "github:aurelia/templating@0.12.1",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:aurelia/templating-router@0.13.0": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.8.1",
      "aurelia-metadata": "github:aurelia/metadata@0.6.0",
      "aurelia-path": "github:aurelia/path@0.7.0",
      "aurelia-router": "github:aurelia/router@0.9.0",
      "aurelia-templating": "github:aurelia/templating@0.12.1"
    },
    "github:aurelia/templating@0.12.1": {
      "aurelia-binding": "github:aurelia/binding@0.7.3",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.8.1",
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
      "aurelia-loader": "github:aurelia/loader@0.7.0",
      "aurelia-logging": "github:aurelia/logging@0.5.0",
      "aurelia-metadata": "github:aurelia/metadata@0.6.0",
      "aurelia-path": "github:aurelia/path@0.7.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.5.0",
      "core-js": "npm:core-js@0.9.18"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:twbs/bootstrap@3.3.5": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    }
  }
});

