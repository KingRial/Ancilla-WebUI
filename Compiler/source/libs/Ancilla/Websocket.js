import {CoreLibrary} from 'ancilla:Core.lib';
import { default as Constant } from 'ancilla:Constants';
import {Event} from 'ancilla:Event';

/**
 * A class to handle websocket communication
 *
 * @class	Event
 * @public
 *
 * @param	{Object}		oOptions		Options to configure the websocket communication
 *
 * @return	{Object}	returns a Promise successfull when communication is ready or failed when an error occurs
 *
 * @example
 *		new Websocket( { sSessiondID: 'randomSession' } );
 */
export class Websocket extends CoreLibrary{
	constructor( oOptions ){
		// Default Options
		oOptions = Object.assign({
			sSessionID: null,
			sLoggerID: 'Websocket',
			fOnNetworkChange: null
		}, oOptions );
		// Calling Super Constructor
		super( oOptions );
		this.__oOptions = oOptions;
		this.__oDefferedAncillaEvents = {};
		this.__oStatus = {
			bIsConnected: false
		};
	}

/**
 * Method used to connect to an URL
 *
 * @method    connect
 * @public
 *
 * @param	{String}		sWsURL			URL to connect to
 *
 * @return	{Object}	returns a Promise successfull when communication is ready or failed when an error occurs
 *
 * @example
 *   Websocket.connect( 'ws://192.168.0.110' );
 */
	connect( sWsURL ){
		this.debug( 'Initializing Web Socket: %o with options: %o...', sWsURL, this.__oOptions );
		var _Websocket = this;
		_Websocket.setWsURL( sWsURL );
		var _oPromise = new Promise( function( fResolve, fReject ){
			_Websocket.__buildWebSocket( fResolve, fReject );
		} );
		return _oPromise;
	}
	/**
	 * Method used to close a connection
	 *
	 * @method    close
	 * @public
	 *
	 * @return	{Void}
	 *
	 * @example
	 *   Websocket.close();
	 */
	close(){
		if( this._oWs ){
			this._oWs.close();
		}
	}

	setWsURL( sWsURL ){
		this.__sWsURL = sWsURL;
	}

	__onNetworkChange( bIsConnected ){
		this.__oStatus.bIsConnected = bIsConnected;
		if( this.__oOptions.fOnNetworkChange ){
			this.__oOptions.fOnNetworkChange( bIsConnected );
		}
	}

	__buildWebSocket( fResolve, fReject ){
		var _Websocket = this;
		var _sWsURL = _Websocket.__sWsURL;
		this._oWs = new WebSocket( _sWsURL );
		this._oWs.onopen = function(){
			_Websocket.__onNetworkChange( true );
			_Websocket.info( 'opened on the following URL: %o', _sWsURL );
			fResolve();
		};
		this._oWs.onerror = function( oEvent ){
			_Websocket.error( 'Fired event error: %o', oEvent );
		};
		this._oWs.onclose = function(){
			_Websocket.__onNetworkChange( false );
			//Trying to reconnect
//TODO: add timer or some kind of controller
			_Websocket.warn( 'closed; trying to reconnect...' );
			_Websocket.__buildWebSocket( fResolve, fReject );
		};
		this._oWs.onmessage = function( oMessage ) {
			_Websocket.debug( 'received data: %o', oMessage );
			var _oAncillaEvent = new Event( JSON.parse( oMessage.data ) );
			if( _oAncillaEvent.getTo() == _Websocket.getSessionID() ){
				_Websocket.debug( 'received %s "%o" ( %o ID: %o )...', ( _oAncillaEvent.isAnswer() ? 'answer' : 'event' ), _oAncillaEvent.getType(), _oAncillaEvent, _oAncillaEvent.getID()  );
				_Websocket.__clearDeferredAncillaRequest( _oAncillaEvent, true );
			} else {
				_Websocket.error( 'received data "%o" not meant for the current client...', _oAncillaEvent );
			}
		};
	}

	getStatus(){
		return this.__oStatus;
	}

	getSessionID(){
		return this.__oOptions.sSessionID;
	}

	__addDeferredAncillaRequest( oAncillaEvent, fResolveCallback, fCallback ){
		this.__oDefferedAncillaEvents[ oAncillaEvent.getID() ] = fResolveCallback;
		if( fCallback ){
			fCallback();
		}
	}

	__clearDeferredAncillaRequest( oAncillaEvent, bSuccess ){
		if( oAncillaEvent.needsAnswer() ){
			var _iAncillaEventID = oAncillaEvent.getID();
			if( this.__oDefferedAncillaEvents[ _iAncillaEventID ] ){
				if( bSuccess ){ // If successfull calling resolve function
					this.__oDefferedAncillaEvents[ _iAncillaEventID ]( oAncillaEvent );
				}
				// Clearing stored deferred ancilla event
				delete this.__oDefferedAncillaEvents[ _iAncillaEventID ];
			}
		}
	}

	/**
	* Method used to trigger an Ancilla Event
	*
	* @method    trigger
	* @public
	*
	* @param	{Object}		oEventOptions				Event options
	*
	* @return	{Promise}	returns a Promise successfull when event has been sent or failed when an error occurs
	*
	* @example
	*   Ancilla.trigger( { sType: 'HelloWorld' } );
	*/
	trigger( oEventOptions ){
		// Event
		oEventOptions = Object.assign({
			sFromID: this.getSessionID()
		}, oEventOptions );
		var _Websocket = this;
		var _oTimeoutHandler = null;
		var _oPromiseReturn = null;
		var _oAncillaEvent = new Event( oEventOptions );
		this.debug( 'Sending to "%s" Ancilla Event: "%o" ( %o ID: %o )', _oAncillaEvent.getTo(), _oAncillaEvent.getType(), _oAncillaEvent, _oAncillaEvent.getID() );
		if( _oAncillaEvent.needsAnswer() ){
			var _oPromiseWait4Answer = new Promise( function( fResolve, fReject ){
					// Storing Resolve function waiting for answer
					_Websocket.__addDeferredAncillaRequest( _oAncillaEvent, fResolve );
				} )
				.then( function( ...rest ){
						// Clearing Timeout
						clearTimeout( _oTimeoutHandler );
						return Promise.resolve( ...rest ); // Returning resolve promise to let the "then" chaining continue
					}
				)
				.catch( function(){
					console.error('TEST1');
					return this;
				})
			;
			// Promise to wait Timeout ( this promise will fail as soon as )
			var _oPromiseToWaitTimeout = new Promise( function( fResolve, fReject ){
					_oTimeoutHandler = setTimeout( function(){
						_Websocket.error( 'Trigger event "%s" with ID: "%s "has not received a response in "%s" seconds.', _oAncillaEvent.getType(), _oAncillaEvent.getID(), _oAncillaEvent.getTimeout()/1000 );
						// Clearing sotred deferred ancilla request
						_Websocket.__clearDeferredAncillaRequest( _oAncillaEvent, false );
						// Rejecting promise
						fReject( new Error('timeout'), _oAncillaEvent );
					}, _oAncillaEvent.getTimeout() );
				})
			;
			// Promise Race
			_oPromiseReturn = Promise.race( [ _oPromiseWait4Answer, _oPromiseToWaitTimeout ] );
		} else {
			// this is a fake promise because we don't need to wait for an answer
			_oPromiseReturn = Promise.resolve();
		}
		this._oWs.send( _oAncillaEvent.toString() );
		// Returning Promise
		return _oPromiseReturn;
	}
}
