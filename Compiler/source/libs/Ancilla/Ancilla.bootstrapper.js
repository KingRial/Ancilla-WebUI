import {Ancilla} from 'ancilla:Ancilla';
import {Tools} from 'ancilla:Tools';
import { default as Constant } from 'ancilla:Constants';
import {Logger} from 'ancilla:Logger';

// Ancila
window[ 'Tools' ] = new Tools();
window[ 'Ancilla' ] = new Ancilla();
var _Ancilla = window.Ancilla;
_Ancilla.setLogLevel( Constant._LOG_DEBUG );
//Bootstrapping Aurelia
_Ancilla.bootstrapAurelia();
// Executing Ancilla
_Ancilla
	.start()
	.then( function(){
		_Ancilla.debug( 'Server contacted' );
		//_Ancilla.bootstrapAurelia();
	})
	.catch( function( oError ){
		_Ancilla.error( '[ Error: %o ] Unable to start ancilla', oError );
	})
;
