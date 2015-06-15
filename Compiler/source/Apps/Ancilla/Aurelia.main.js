import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';
import {Ancilla} from 'ancilla:Ancilla';

var _Ancilla = window.Ancilla;
//LogManager.setLevel( _Ancilla.getLogLevel() );
//LogManager.setLevel( ( Ancilla.getDebug() ? LogManager.levels.debug : LogManager.levels.error ) );

export function configure( aurelia ){
	// Configuring Aurelia
	aurelia
		.use
			//.defaultBindingLanguage()
			//.defaultResources()
			//.router()
			//.eventAggregator()
			//es5()
			//.developmentLogging()
			//.standardConfiguration()
			//.plugin('./path/to/plugin')
			.standardConfiguration()
    	.developmentLogging()
	;
	// Starting Aurelia
	aurelia
		.start()
		.then( a => a.setRoot( 'App', document.body ) )
	;
}
