import {CoreLibrary} from 'ancilla:Core.lib';
import { default as Constant } from 'ancilla:Constants';
import { default as Tools} from 'ancilla:Tools';
import { default as Authenticator} from 'ancilla:Authenticator.oAuth2';
import { default as DBManager } from 'ancilla:DBManager';
import {Websocket} from 'ancilla:Websocket';
import {WidgetCore} from 'ancilla:Widget.core';
import {ObjectUser} from 'ancilla:Object.user';
//import 'bluebird'; // TODO: should I use bluebird ? it gives warnings with aurelia
// TODO: dynamic languages
import { default as Language } from 'languages:english';

/**
 * A class to describe the Ancilla library
 *
 * @class	Event
 * @private
 *
 * @param	{Object}		oOptions		Options to configure the Ancilla library
 *
 * @return	{Void}
 *
 * @example
 *		new AncillaClass();
 */
class AncillaClass extends CoreLibrary {
	constructor( oOptions ){
		// Default Options
		oOptions = Object.assign({
			sLoggerID: 'Ancilla'
		}, oOptions );
		// Calling Super Constructor
		super( oOptions );
		// Remebering Options
		this.__oOptions = oOptions;
		this.__oLanguageConstants = Language;
		// Ancilla Status
		this.__oStatus = {
			bIsConnected: false
		};
		this.__oMemoryCache = {
			oObjs: {},											// Caching loaded objects by IDs
			oRelations: {},									// Caching loaded relations by IDs
			oWidgets: {											// Caching loaded widgets by IDs
				'-1': new WidgetCore({ id: -1, name: '_LANG_NULL_WIDGET' })
			},
			oLoadedSurroundingsByID: {}		// Caching loaded surroundings by object's IDs
		};
		// Ancilla Messages
		this.oMessages = {
			aErrors: [],
			aWarnings: [],
			aInfos: []
		};
		this.__oServerRules = null;
		//oAuth
		this.__oAuth = new Authenticator( {
			sBaseURL: this.getServerAddress(),
			onLoggingOut: () => this.redirect( 'logout' )
		});
		//DB Manager
		this.__oDBManager = new DBManager({
			sBaseURL: this.getServerAddress(),
			oAuthenticator: this.__oAuth
		});
	}

	getOptions( sField ){
		return ( sField ? this.__oOptions[ sField ] : this.__oOptions );
	}

	setOption( sField, value ){
		this.__oOptions[ sField ] = value;
	}

	getProtocol( sType, sURL ){
		var _sProtocol = null;
		switch( sType ){
			case 'websocket':
				_sProtocol = ( Tools.getProtocol( sURL ) === 'http' ? 'ws' : 'wss' );
			break;
			case 'web':
			/* falls through */
			default:
				_sProtocol = Tools.getProtocol( sURL );
			break;
		}
		return _sProtocol;
	}

	getServerIP( sURL ){
		return Tools.getIP( sURL );
	}

	getServerPort( sType, sURL ){
		let _sPort = null;
		let _sProtocol = this.getProtocol( sType, sURL );
		switch( sType ){
			case 'websocket':
				_sPort = ( _sProtocol === 'ws' ? Constant._PORT_SERVER_WS : Constant._PORT_SERVER_WSS );
			break;
			case 'web':
			/* falls through */
			default:
				_sPort = Tools.getPort( sURL );
				//_sPort = ( _sProtocol === 'http' ? Constant._PORT_SERVER_HTTP : Constant._PORT_SERVER_HTTPS );
			break;
		}
		return _sPort;
	}

	getServerAddress( sType, sURL ){
		let _sPort = this.getServerPort( sType, sURL );
		return this.getProtocol( sType, sURL ) + '://' + this.getServerIP( sURL ) + ( _sPort ? ':' + _sPort : '' );
	}

	setServerAddress( sURL ){
		var _sWsURL = this.getServerAddress( 'websocket', sURL );
		this.getWebSocket().setWsURL( _sWsURL );
	}

	/**
	* Method used to obtain a software costants ( it depends from the current selected language )
	*
	* @method    getConstant
	* @public
	*
	* @param	{String}		sString				constant to translate
	*
	* @return	{String/Number}	returns the translated constant
	*
	* @example
	*   Ancilla.getConstant( '_NO_ERROR' );
	*/
	getConstant( sString ){
		return ( this.__oLanguageConstants[ sString ] ? this.__oLanguageConstants[ sString ] : sString );
	}

	setCurrentUser( oUser ){
		this.__oCurrentUser = ( oUser ? new ObjectUser( oUser ) : null ) ;
		this.info( 'current user is set to: "%o" [%o]', ( this.__oCurrentUser ? this.__oCurrentUser.name : 'none' ), this.__oCurrentUser );
	}

	getCurrentUser(){
		return this.__oCurrentUser;
	}

	setServerRules( oRules ){
		this.__oServerRules = oRules;
	}

	getServerRules(){
		return this.__oServerRules;
	}

	isAuthenticated(){
		return this.__oAuth.isAuthenticated();
	}

	logInAs( sUsername, sPassword, bRememberMe ){
		//let _Ancilla = this;
		return this.__oAuth.logInAs( sUsername, sPassword, bRememberMe );
	}

	logOut(){
		return this.__oAuth.logOut();
	}

	redirect( sRoute ){
		this.debug( 'Redirecting to route %o...', sRoute );
		if( this.__onRedirect ){
			this.__onRedirect( sRoute );
		} else {
			this.error( 'Unable to redirect to route %o; missing redirect handler.', sRoute );
		}
	}

	getStatus( sStatus ){
		return ( sStatus ? this.__oStatus[ sStatus ] : this.__oStatus );
	}

	__onStatusChange( sStatus, value ){
		this.debug( '[__onStatusChange] changed status "%o" to "%o"', sStatus, value );
		this.__oStatus[ sStatus ] = value;
	}

	getMessages(){
		return this.oMessages;
	}

	__getMessageArrayNameFromType( sType ){
		return 'a' + sType.charAt(0).toUpperCase() + sType.slice(1)+ 's';
	}

	addMessage( sType, oMessage ){
		oMessage = Object.assign({
			iCode: null,
			sMessage: null
		}, oMessage );
		let _sMessageType = this.__getMessageArrayNameFromType( sType );
		let _aMessage = this.oMessages[ _sMessageType ];
		let _aDuplicateMessage = _aMessage.filter( function( oItem ){
			return ( oItem.iCode === oMessage.iCode );
		});
		if( _aDuplicateMessage.length === 0){
			_aMessage.push( oMessage );
		}
	}

	messageError( iCode, sMessage ){
		this.addMessage( 'error', {
			iCode: iCode,
			sMessage: sMessage
		} );
	}

	handleMessage( sType, iIndex ){
    this.oMessages[ this.__getMessageArrayNameFromType( sType ) ].splice( iIndex, 1 );
	}

	/**
	 * Method used to initialize websocket communication
	 *
	 * @method    __initWebSocket
	 * @private
	 *
	 * @param	{String}		sWsURL				URL to connect to
	 * @param	{Object}		[oOptions]		Options
	 *
	 * @return	{Object}	returns a Promise successfull when communication is ready or failed when an error occurs
	 *
	 * @example
	 *   Ancilla.__initWebSocket( 'ws://192.168.0.110' );
	 */
  __initWebSocket( sWsURL, oOptions ){
		var _Ancilla = this;
		oOptions = Object.assign({
			sSessionID: this.getUID(),
			fOnNetworkChange: ( bIsConnected ) => this.__onStatusChange( 'bIsConnected', bIsConnected ) // Ancilla callback to websocket's network status event
		}, oOptions );
		this.setWebSocket( new Websocket( oOptions ) );
		return new Promise( function( fResolve, fReject ){
			_Ancilla.getWebSocket()
					.connect( sWsURL )
					/*
					.then( function(){
						_Ancilla.trigger( { sType: Constant._EVENT_TYPE_INTRODUCE } )
							.then( function( oEvent ){
								if( oEvent.oUser ){
									_Ancilla.setCurrentUser( oEvent.oUser );
								}
								_Ancilla.info( 'successfully introduced as technology: "%o" and logged as "%o"', oOptions.sSessionID, ( _Ancilla.getCurrentUser() ? _Ancilla.getCurrentUser().name : 'noone' ) );
								fResolve();
							})
							.catch( function( oError ){
								_Ancilla.error( '[ Error: %o ] Unable to introduce as: "%o"', oError, oOptions.sSessionID );
								_Ancilla.getWebSocket().close();
							})
						;
					})
					*/
					.catch( function( oError ){
						_Ancilla.error( '[ Error: %o ] Unable to connect to websocket', oError );
						fReject( oError );
					})
				;
		});
	}
	/**
	 * Method used to set the websocket object
	 *
	 * @method    setWebSocket
	 * @public
	 *
	 * @param	{Object}		oWebSocket		The Websocket Object
	 *
	 * @return	{Void}
	 *
	 * @example
	 *   Ancilla.setWebSocket( oWebSocket );
	 */
	setWebSocket( oWebSocket ){
		this._oWS = oWebSocket;
	}
	/**
	 * Method used to obtain the websocket object
	 *
	 * @method    getWebSocket
	 * @public
	 *
	 * @return	{Object}	returns the websocket object
	 *
	 * @example
	 *   Ancilla.getWebSocket();
	 */
	getWebSocket(){
		return this._oWS;
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
		return this.getWebSocket().trigger( oEventOptions );
	}

	getDB(){
		return this.__oDBManager;
	}

	query( oJSONQuery, oOptions ){
		oOptions = Object.assign({
			bFromCache: false,
			bFromServer: false
		}, oOptions );
		return this.getDB().query( oJSONQuery, oOptions );
	}

	/**
	 * Method used load an object into the library
	 *
	 * @method	getObj
	 * @private
	 *
	 * @param		{Number/String/Array}		item	An object's ID, an array of object's IDs or JSON where predicate
	 *
	 * @return	{Promise}	returns a Promise successfull when object has been loaded or failed when an error occurs
	 *
	 * @example
	 *	Ancilla.getObj( 1 );
	 *  Ancilla.getObj( { id: 1 } );
	 */
	getObj( item, oOptions ){
		oOptions = Object.assign({
			bFromCache: false,
			bFromServer: false
		}, oOptions );
		let _Ancilla = this;
		let _oEntityCached = _Ancilla.getObjCached( item );
		if( !oOptions.bFromServer && _oEntityCached ){
			return Promise.resolve ( _oEntityCached );
		} else {
			return this.__getEntity( 'OBJECT', item, oOptions )
				.then( function( aQueryResults ){
					return _Ancilla.__createEntity( 'Object', 'oObjs', aQueryResults, oOptions );
				})
				// Collecting surroundings for the current obtained objects, if needed
				.then( function( getObjResult ){
					let _aSurroundingIDsToLoad = [];
					let _aWidgetsIDsToLoad = [];
					let _aObjs = ( Array.isArray( getObjResult ) ? getObjResult : ( getObjResult ? [ getObjResult ] : [] ) );
					// Checking object's surrounding flag
					_aObjs.forEach( function( oObj ){
						if( !_Ancilla.__geEntityCache( 'oLoadedSurroundingsByID', oObj.id ) ){
							if( _aSurroundingIDsToLoad.indexOf( oObj.id )===-1 ){
								_aSurroundingIDsToLoad.push( oObj.id );
							}
							if( _aWidgetsIDsToLoad.indexOf( oObj.widgetID )===-1 ){
								_aWidgetsIDsToLoad.push( oObj.widgetID );
							}
						}
					});
					// Loading surrounding if needed
					if( _aSurroundingIDsToLoad.length > 0 ){
						return _Ancilla.getRelation({
							or: [
								{ parentID: { in: _aSurroundingIDsToLoad } },
								{ childID: { in: _aSurroundingIDsToLoad } }
							]
						})
							.then( function(){
								return _Ancilla.getWidget({
									id: { in: _aWidgetsIDsToLoad }
								})
								.then( function(){
									// Remembring object's surrounding flag
									_aSurroundingIDsToLoad.forEach( function( iID ){
										_Ancilla.__seEntityCache( 'oLoadedSurroundingsByID', iID, true );
									});
									return getObjResult;
								});
							})
						;
					} else {
						return getObjResult;
					}
				})
			;
		}
	}

	getRelation( item, oOptions ){
		oOptions = Object.assign({
			bFromCache: false,
			bFromServer: false
		}, oOptions );
		let _Ancilla = this;
		let _oEntityCached = _Ancilla.getRelationCached( item );
		if( !oOptions.bFromServer && _oEntityCached ){
			return Promise.resolve ( _oEntityCached );
		} else {
			return this.__getEntity( 'RELATION', item, oOptions )
				.then( function( aQueryResults ){
					return _Ancilla.__createEntity( 'Relation', 'oRelations', aQueryResults, oOptions )
						.then( function( result ){
							return ( Array.isArray( result ) ? result : ( result ? [ result ] : [] ) );
						})
					;
				})
			;
		}
	}

	getWidget( item, oOptions ){
		oOptions = Object.assign({
			bFromCache: false,
			bFromServer: false
		}, oOptions );
		let _Ancilla = this;
		let _oEntityCached = _Ancilla.getWidgetCached( item );
		if( !oOptions.bFromServer && _oEntityCached ){
			return Promise.resolve ( _oEntityCached );
		} else {
			return this.__getEntity( 'WIDGET', item, oOptions )
				.then( function( aQueryResults ){
					return _Ancilla.__createEntity( 'Widget', 'oWidgets', aQueryResults, oOptions )
						.then( function( result ){
							return ( Array.isArray( result ) ? result : ( result ? [ result ] : [] ) );
						})
					;
				})
			;
		}
	}

	__getEntity( sResourceName, item, oOptions ){
		let _Ancilla = this;
		let _bItemisObject = ( typeof item === 'object' );
		let _oPredicate = ( _bItemisObject ? ( _bItemisObject && item.oWhere ? item.oWhere : ( item.iTake || item.iSkip || item.aOrderBy ? null : item ) ) : { 'id': item } );
		let _oQuery = {
			from: sResourceName,
			where: _oPredicate,
			take:  ( ( _bItemisObject && item.iTake ) ? item.iTake : null ),
			skip:  ( ( _bItemisObject && item.iSkip ) ? item.iSkip : null ),
			orderBy:  ( ( _bItemisObject && item.aOrderBy ) ? item.aOrderBy : null )
		};
		return this.query( _oQuery, oOptions )
			.catch( function( oError ){
				_Ancilla.error( '[Error "%o"] failed to load "%o -> %o" from server', oError, sResourceName, item );
				throw oError ;
			})
		;
	}

	__geEntityCache( sCacheType, key ){
		return this.__oMemoryCache[ sCacheType ][ key ];
	}

	getObjCached( item ){
		return this.__geEntityCache( 'oObjs', item );
	}

	getRelationCached( item ){
		return this.__geEntityCache( 'oRelations', item );
	}

	getWidgetCached( item ){
		return this.__geEntityCache( 'oWidgets', item );
	}

	__seEntityCache( sCacheType, key, value ){
		this.__oMemoryCache[ sCacheType ][ key ] = value;
	}

	__createEntity( sClassType, sCacheType, aItems, oOptions ){
		oOptions = Object.assign({
			bDisableResultRedux: true
		}, oOptions );
		let _Ancilla = this;
		// Dinamically importing needed Classes
		let _aLibsToImport = [];
		aItems.forEach( function( oItem ){
			let _sDependency = 'ancilla:' + sClassType + '.' + ( oItem.type ? oItem.type.toLowerCase() : 'core' );
			if( _aLibsToImport.indexOf( _sDependency ) === -1 ){
				_aLibsToImport.push( _sDependency );
			}
		} );
		return Tools.import( _aLibsToImport )
			.then( function( aClasses ){
				let _aEntities = [];
				aItems.forEach(function( oItem ){
					let _oCachedEntity = _Ancilla.__geEntityCache( sCacheType, oItem.id );
					if( _oCachedEntity ){
						_aEntities.push( _oCachedEntity );
					} else {
						// Building class name
						let _sType = ( oItem.type ? oItem.type.toLowerCase() : 'core' );
						let _sClass = sClassType + _sType.charAt(0).toUpperCase() + _sType.slice(1);
						// Istantiating object
						let fClass = null;
						for( let _iIndex=0; _iIndex<aClasses.length; _iIndex++ ){
							let _oCurrentLibClass = aClasses[ _iIndex ];
							if( _oCurrentLibClass[ _sClass ] ){
								fClass = _oCurrentLibClass[ _sClass ];
								break;
							}
						}
						if( fClass ){
							let _oEntity = new fClass( oItem );
							_aEntities.push( _oEntity );
							_Ancilla.__seEntityCache( sCacheType, _oEntity.id, _oEntity );
						} else {
							_Ancilla.error( 'Unable to find class "%o"', _sClass );
						}
					}
				});
				return ( oOptions.bDisableResultRedux ? ( _aEntities.length > 1 ? _aEntities : _aEntities[ 0 ] ) : _aEntities );
			})
		;
	}

	cachesSave(){
		let _Ancilla = this;
		return this.__oDBManager.cacheSave()
			.then( function(){
				_Ancilla.info( 'Saved caches' );
			})
			.catch( function( oError ){
				_Ancilla.info( 'Failed to save caches. Error: %o', oError );
			})
		;
	}

	cachesClear(){
		let _Ancilla = this;
		return this.__oAuth.clearTokens()
			.then( function(){
				return _Ancilla.__oDBManager.cacheClear();
			})
			.then( function(){
				_Ancilla.info( 'Cleared caches' );
			})
			.catch( function( oError ){
				_Ancilla.info( 'Failed to clear caches. Error: %o', oError );
			})
		;
	}

	/**
	 * Method used to check when Ancilla is ready
	 *
	 * @method    ready
	 * @public
	 *
	 * @return	{Object}	returns a Promise successfull when Ancilla is ready or failed when an error occurs
	 *
	 * @example
	 *   Ancilla.ready();
	 */
	ready( oOptions ){
		this.info('Starting...');
		this.__onRedirect = oOptions.fRedirect;
		// Init WebSocket
		//var _oOptions = this.getOptions();
		//var _sWsURL = this.getServerAddress( 'websocket' );
		var _Ancilla = this;
		return _Ancilla.__oDBManager.ready()
			.then( function(){
				return _Ancilla.__oAuth.ready();
			})
			/*
			.then( function(){
				return _Ancilla.__initWebSocket( _sWsURL );
			})
			*/
			.then(function(){
				_Ancilla.info( 'Ready.' );
			})
			.catch(function(oError){
				_Ancilla.error( '[ Error: %o ] Unable to start Ancilla.', oError );
			})
		;
	}
}

// Exporting Singleton
const Ancilla = new AncillaClass();
// Singleton is now accessible as a global window var
if( !window.Ancilla ){
	window.Ancilla = Ancilla;
}
export default Ancilla;
