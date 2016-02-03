import {CoreLibrary} from 'ancilla:Core.lib';
import { default as Constant } from 'ancilla:Constants';
import { default as Tools} from 'ancilla:Tools';
import {Websocket} from 'ancilla:Websocket';
import {WidgetCore} from 'ancilla:Widget.core';
import {ObjectUser} from 'ancilla:Object.user';
//import { default as Forge} from 'forge';
//import 'bluebird'; // TODO: should I use bluebird ?
//import breeze from 'breeze';
//var query = new breeze.EntityQuery();
// TODO:: dynamic languages
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
		// Remebring Options
		this.__oOptions = oOptions;
		this.__oLanguageConstants = Language;
		this.__oMemoryCache = {
			oObjs: {},											// Caching loaded objects by IDs
			oObjsByParents: {},							// Caching acces objects by parents IDs
			oObjsByChildren: {},						// Caching acces objects by children IDs
			oRelations: {},									// Caching loaded relations by IDs
			oWidgets: {											// Caching loaded widgets by IDs
				'-1': new WidgetCore({ id: -1, name: '_LANG_NULL_WIDGET' })
			},
			oLoadedSurroundingsByID: {},		// Caching loaded surroundings by object's IDs
			oLoadedSurroundingsByType: {},	// Caching loaded surroundings by object's types
		};
		// Ancilla Status
		this.__oStatus = {
			bIsConnected: false
		};
	}

	getOptions( sField ){
		return ( sField ? this.__oOptions[ sField ] : this.__oOptions );
	}

	setOption( sField, value ){
		this.__oOptions[ sField ] = value;
	}

	getStatus( sStatus ){
		return ( sStatus ? this.__oStatus[ sStatus ] : this.__oStatus );
	}

	getProtocol( sType, sURL ){
		var _sProtocol = null;
		switch( sType ){
			case 'websocket':
				_sProtocol = ( Tools.getProtocol( sURL ) === 'http' ? 'ws' : 'wss' );
			break;
			case 'web':
			//default:
				_sProtocol = Tools.getProtocol( sURL );
			break;
		}
		return _sProtocol;
	}

	getServerIP( sURL ){
		return Tools.getIP( sURL );
	}

	getServerPort( sType, sURL ){
		var _sPort = null;
		var _sProtocol = this.getProtocol( sType, sURL );
		switch( sType ){
			case 'websocket':
				_sPort = ( _sProtocol === 'ws' ? Constant._PORT_WS : Constant._PORT_WSS );
			break;
			case 'web':
			//default:
				_sPort = ( _sProtocol === 'http' ? Constant._PORT_HTTP : Constant._PORT_HTTPS );
			break;
		}
		return _sPort;
	}

	getServerAddress( sType, sURL ){
		return this.getProtocol( sType, sURL ) + '://' + this.getServerIP( sURL ) + ':' + this.getServerPort( sType, sURL ) + '/';
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

	/**
	 * Method used to obtain a web unique ID ( UID )
	 *
	 * @method    getUID
	 * @public
	 *
	 *
	 * @return	{String}	returns a web unique ID ( UID )
	 *
	 * @example
	 *   Ancilla.getUUID();
	 */
	getUUID(){
		if( !this._sUUID ){
//TODO: handle localstorage with a custom lib
//TODO: handle mobile UID
			var _sUUID = ( localStorage ? localStorage.getItem( 'UID' ) : null );
			if( !_sUUID ){
				//var _sDate = ( new Date() ).valueOf().toString();
				//var _sRandom = Math.random().toString();
				// Using Forge Lib to generate a random sessiond ID ( https://github.com/digitalbazaar/forge )
				// We are not using the SESSIOND ID in the Cookies since we are planning to evade to use PHP or similar
				//_sUUID = 'web-' + Forge.md.sha1.create().update( _sDate + _sRandom ).digest().toHex();
//TODO: create UUID
				_sUUID = 'fake-UUID';
				this.info( 'creating missing UID: "%o"', _sUUID );
				localStorage.setItem( 'UID', _sUUID );
			}
			this._sUUID = _sUUID;
		}
		this.info( 'using UID: "%o"', this._sUUID );
		return this._sUUID;
	}

	__onStatusChange( sStatus, value ){
		this.debug( '[__onStatusChange] changed status "%o" to "%o"', sStatus, value );
		this.__oStatus[ sStatus ] = value;
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

	/**
	 * Method used load an object into the library
	 *
	 * @method	loadObj
	 * @private
	 *
	 * @param		{Number/String/Array}		toLoad	An object's ID, an object's type, an array of object's IDs or an array of object's types
	 *
	 * @return	{Promise}	returns a Promise successfull when object has been loaded or failed when an error occurs
	 *
	 * @example
	 *   Ancilla.loadObj( 'GROUP' );
	 */
/*
	loadObj( toLoad ){
		toLoad = ( Array.isArray( toLoad ) ? toLoad : [ toLoad ] );
		var _bLoadByID = ( isNaN( toLoad[ 0 ] ) ? false : true );
		var _bLoadByType = ( isNaN( toLoad[ 0 ] ) ? true : false );
		if( _bLoadByID ){
			return this.__loadObjByID( toLoad );
		} else if( _bLoadByType ) {
			return this.__loadObjByType( toLoad );
		} else {
			this.error('unable to understand how to load objects; please check the parameters.');
		}
	}
*/
	/**
	 * Method used load an object into the library
	 *
	 * @method    __loadObjByID
	 * @private
	 *
	 * @param		{Number/Array}		ids				An ID of the object table or an array of IDs
	 *
	 * @return	{Promise}	returns a Promise successfull when object has been loaded or failed when an error occurs
	 *
	 * @example
	 *   Ancilla.__loadObjByID( 1 );
	 */
/*
	__loadObjByID( ids ){
		var _oLoadPromise = null;
		var _Ancilla = this;
		ids = ( Array.isArray( ids ) ? ids : [ ids ] );
		var _aObjectIDsToSearch = this.__objIDsNotLoaded( ids );
		if( _aObjectIDsToSearch.length === 0 ){
			this.debug( '[__loadObjByID] nothing to load' );
			_oLoadPromise = Promise.resolve();
		} else {
			this.debug( '[__loadObjByID] object\'s IDs to load from server: "%o"', _aObjectIDsToSearch );
			_oLoadPromise = new Promise( function( fResolve, fReject ){
				_Ancilla
					.trigger({ sType: Constant._EVENT_TYPE_OBJ_LOAD_BY_ID, ids: _aObjectIDsToSearch })
					.then( function( oAncillaEvent ){
						var _oSurroundings = oAncillaEvent.oRows;
						_Ancilla.__cacheSurroundings( _oSurroundings )
							.then( function(){
								fResolve();
							})
							.catch(function( oError ){
								fReject( oError );
							})
						;
					})
					.catch( function( oError ){
						_Ancilla.error( '[__loadObjByID][Error "%o"] failed to load objects "%o"', oError, ids );
						fReject( oError );
					})
				;
			} );
		}
		return _oLoadPromise;
	}
*/
	/**
	 * Method used load an object into the library
	 *
	 * @method    __loadObjByType
	 * @private
	 *
	 * @param		{String/Array}		types				A type of the object table or an array of types
	 *
	 * @return	{Promise}	returns a Promise rejects when an error occurs or success with an array of loaded IDs as first parameter
	 *
	 * @example
	 *   Ancilla.__loadObjByType( 'GROUP' );
	 */
	 /*
	__loadObjByType( types ){
			var _oLoadPromise = null;
			var _Ancilla = this;
			types = ( Array.isArray( types ) ? types : [ types ] );
			var _aObjectTypesToSearch = this.__objTypesNotLoaded( types );
			if( _aObjectTypesToSearch.length === 0 ){
				this.debug( '[__loadObjByType] nothing to load' );
				// Returning promise with array of already loaded IDs
				var _aIDsByType = [];
				for( var _iIndex in types ){
					_aIDsByType = _aIDsByType.concat( this.__oMemoryCache.oLoadedSurroundingsByType[ types[ _iIndex ] ] );
				}
				_oLoadPromise = Promise.resolve( _aIDsByType );
			} else {
				this.debug( '[__loadObjByType] object\'s types to load from server: "%o"', _aObjectTypesToSearch );
				_oLoadPromise = new Promise( function( fResolve, fReject ){
					_Ancilla
						.trigger({ sType: Constant._EVENT_TYPE_OBJ_LOAD_BY_TYPE, types: _aObjectTypesToSearch })
						.then( function( oAncillaEvent ){
							var _oSurroundings = oAncillaEvent.oRows;
							_Ancilla.__cacheSurroundings( _oSurroundings )
								.then( function(){
									// Remembering the object types which have surrounding loaded
									_Ancilla.__setLoadedSurrouding( types, _oSurroundings.aLoadedSurroundings );
									fResolve( _oSurroundings.aLoadedSurroundings );
								})
								.catch(function( oError ){
									fReject( oError );
								})
							;
						})
						.catch( function( oError ){
							_Ancilla.error( '[__loadObjByType][Error "%o"] failed to load objects "%o"', oError, types );
							fReject( oError );
						})
					;
				});
			}
			return _oLoadPromise;
	}
*/
	/**
	 * Method used remember what objects have their surrounding already loaded
	 *
	 * @method    __setLoadedSurrouding
	 * @private
	 *
	 * @param		{Number/String/Array}		toRemember	An object's ID, an object's type, an array of object's IDs or an array of object's types
	* @param		{Array}									[aIDs]			Loaded IDs, by type
	 *
	 * @example
	 *   Ancilla.__setLoadedSurrouding( 1 );
	 *   Ancilla.__setLoadedSurrouding( [ 1 , 2 ] );
	 *   Ancilla.__setLoadedSurrouding( 'GROUP' );
	 *   Ancilla.__setLoadedSurrouding( [ 'GROUP', 'TECHNOLOGY' ] );
	 */
/*
	__setLoadedSurrouding( toRemember, aIDs ){
		toRemember = ( Array.isArray( toRemember ) ? toRemember : [ toRemember ] );
		var _bRememberByID = ( isNaN( toRemember[ 0 ] ) ? false : true );
		var _bRememberByType = ( isNaN( toRemember[ 0 ] ) ? true : false );
		if( _bRememberByID ){
			this.__setLoadedSurroundingByID( toRemember );
		} else if( _bRememberByType ) {
			this.__setLoadedSurroundingByType( toRemember, aIDs );
		} else {
			this.error('unable to understand how to remember objects; please check the parameters.');
		}
	}
*/
 /**
	* Method used to remeber what objects have their surrounding already loaded by their IDs
	*
	* @method    __setLoadedSurroundingByID
	* @private
	*
	* @param		{Array}		aIDs	An array of object's IDs to remember
	*
	* @example
	*   Ancilla.__setLoadedSurroundingByID( 1 );
	*/
	/*
	__setLoadedSurroundingByID( aIDs ){
		this.debug('loaded object\'s surroundings by IDs: "%o"', aIDs);
		for( var _iIndex in aIDs ){
			var iID = aIDs[ _iIndex ];
			if( !this.__oMemoryCache.oLoadedSurroundingsByID[ iID ] ){
				this.__oMemoryCache.oLoadedSurroundingsByID[ iID ] = true;
			} else {
				this.error( 'object (%o) surrounding already loaded; please check why it happens.', iID );
			}
		}
	}
	*/
 /**
	* Method used to remeber what objects have their surrounding already loaded by their types
	*
	* @method    __setLoadedSurroundingByType
	* @private
	*
	* @param		{Array}		aTypes	An array of object's types to remember
	* @param		{Array}		aIDs		An array of object's IDs for the current types to remember
	*
	* @example
	*   Ancilla.__setLoadedSurroundingByType( 'GROUP' );
	*/
/*
	__setLoadedSurroundingByType( aTypes, aIDs ){
		this.debug('loaded object\'s surroundings by types: "%o"', aTypes);
		for( var _iIndex in aTypes ){
			var sType = aTypes[ _iIndex ];
			if( !this.__oMemoryCache.oLoadedSurroundingsByType[ sType ] ){
				this.__oMemoryCache.oLoadedSurroundingsByType[ sType ] = [];
				for( var _iIndex in aIDs ){
					var _iCurrentID = aIDs[ _iIndex ];
					if( this.getObj( _iCurrentID ).getType() == sType ){
						this.__oMemoryCache.oLoadedSurroundingsByType[ sType ].push( _iCurrentID );
					}
				}
			} else {
				this.error( 'object (%o) surrounding already loaded; please check why it happens.', sType );
			}
		}
	}
*/
	/**
	* Method used to check if an object is loaded completly
	*
	* @method    __objIDsNotLoaded
	* @private
	*
	* @param	{Array}		aIDs				The object's IDs to check
	*
	* @return	{Array}		it returns the IDs not loaded
	*
	* @example
	*   Ancilla.__objIDsNotLoaded( [ 1, 2, 3 ] );
	*/
/*
	__objIDsNotLoaded( aIDs ){
		var _aObjectIDsToSearch = [];
		for( var _iIndex in aIDs ){
			var _iCurrentID = aIDs[ _iIndex ];
			var _oCurrentObj = this.getObj( _iCurrentID );
			if( !_oCurrentObj || !this.__oMemoryCache.oLoadedSurroundingsByID[ _iCurrentID ] ){
				_aObjectIDsToSearch.push( _iCurrentID );
			}
		}
		return _aObjectIDsToSearch;
	}
*/
	/**
	* Method used to check if an object's type is loaded completly
	*
	* @method    __objTypesNotLoaded
	* @private
	*
	* @param	{Array}		aTypes				The object's IDs to check
	*
	* @return	{Array}		it returns the object's types not loaded
	*
	* @example
	*   Ancilla.__objTypesNotLoaded( [ 'GROUP', 'TECHNOLOGY' ] );
	*/
/*
	__objTypesNotLoaded( aTypes ){
		var _aObjectTypesToSearch = [];
		for( var _iIndex in aTypes ){
			var _sCurrentType = aTypes[ _iIndex ];
			if( !this.__oMemoryCache.oLoadedSurroundingsByType[ _sCurrentType ] ){
				_aObjectTypesToSearch.push( _sCurrentType );
			}
		}
		return _aObjectTypesToSearch;
	}
*/
	/**
	 * Method used cache object's surroundings
	 *
	 * @method    __cacheSurroundings
	 * @private
	 *
   * @param		{Object}	oSurrounding				The objects describing a surrounding of particular ids
	 *
	 * @return	{Void}
	 *
	 * @example
	 *   Ancilla.__cacheSurroundings( { surrounding } );
	 */
/*
	__cacheSurroundings( oSurrounding ){
		var _Ancilla = this;
		return new Promise( function( fResolve, fReject ){
			if( oSurrounding && ( oSurrounding.aObjs || oSurrounding.aRelations || oSurrounding.oWidgets ) ){
				var _aObjs = oSurrounding.aObjs;
				var _aRelations = oSurrounding.aRelations;
				var _oWidgets = oSurrounding.oWidgets;
				// Dinamically importing needed Classes
				var _aLibsToImport = [];
				for( var _iIndex in _aObjs ){
					var _aRow = _aObjs[ _iIndex ];
					var _sDependency = 'ancilla:Object.' + _aRow[ 'TYPE' ].toLowerCase();
					if( _aLibsToImport.indexOf( _sDependency ) == -1 ){
						_aLibsToImport.push( _sDependency );
					}
				}
				for( var _iIndex in _aRelations ){
					var _aRow = _aRelations[ _iIndex ];
					var _sDependency = 'ancilla:Relation.' + _aRow[ 'TYPE' ].toLowerCase();
					if( _aLibsToImport.indexOf( _sDependency ) == -1 ){
						_aLibsToImport.push( _sDependency );
					}
				}
				for( var _iIndex in _oWidgets ){
//TODO: libreria dinamica ?
					var _sDependency = 'ancilla:Widget.core';
					if( _aLibsToImport.indexOf( _sDependency ) == -1 ){
						_aLibsToImport.push( _sDependency );
					}
				}
				Tools.import( _aLibsToImport )
					.then( function( aClasses ){
						// Creating OBJECTS
						var _aLoadedObjs = [];
						var _aLoadedIDs = [];
						for( var _iIndex in _aObjs ){
							var _aCurrentRow = _aObjs[ _iIndex ];
							var _sType = _aCurrentRow[ 'TYPE' ].toLowerCase();
							var _sClass = 'Object' + _sType.charAt(0).toUpperCase() + _sType.slice(1);
							var fClass = null;
							// Looking for dynamic class
							var _bFound = false;
							for( var _iIndex in aClasses ){
								var _oCurrentLibClass = aClasses[ _iIndex ];
								if( _oCurrentLibClass[ _sClass ] ){
									fClass = aClasses[ _iIndex ][ _sClass ];
									_bFound = true;
									break;
								}
							}
							if( !_bFound ){
								_Ancilla.error( 'Unable to find object class "%o"', _sClass );
							}
							var _oCurrentObj = new fClass( _aCurrentRow );
							_aLoadedObjs.push( _oCurrentObj );
							_aLoadedIDs.push( _oCurrentObj.getID() );
						}
						// Remembering the objects which have surrounding loaded
						_Ancilla.__setLoadedSurrouding( oSurrounding.aLoadedSurroundings );
						_Ancilla.debug( '[__cacheSurroundings] loaded objects "%o"', _aLoadedObjs );
						// Caching results in memory
						_Ancilla.__cacheObjects( _aLoadedObjs );
						// Creating RELATIONS
						var _aLoadedRelations = [];
						for( var _iIndex in _aRelations ){
							var _aCurrentRow = _aRelations[ _iIndex ];
							var _sType = _aCurrentRow[ 'TYPE' ].toLowerCase();
							var _sClass = 'Relation' + _sType.charAt(0).toUpperCase() + _sType.slice(1);
							var fClass = null;
							// Looking for dynamic class
							var _bFound = false;
							for( var _iIndex in aClasses ){
								var _oCurrentLibClass = aClasses[ _iIndex ];
								if( _oCurrentLibClass[ _sClass ] ){
									fClass = aClasses[ _iIndex ][ _sClass ];
									_bFound = true;
									break;
								}
							}
							if( !_bFound ){
								_Ancilla.error( '[__cacheSurroundings] Unable to find relation class "%o"', _sClass );
							}
							var _oCurrentRelation = new fClass( _aCurrentRow );
							_aLoadedRelations.push( _oCurrentRelation );
						}
						_Ancilla.debug( '[__cacheSurroundings] loaded relations ""%o"', _aLoadedRelations );
						// Caching results in memory
						_Ancilla.__cacheRelations( _aLoadedRelations );
						// Creating WIDGETS
						var _aLoadedWidgets = [];
						for( var _iIndex in _oWidgets ){
							var _aCurrentRow = _oWidgets[ _iIndex ];
	//TODO: classe dinamica
							var _sClass = 'WidgetCore';
							var fClass = null;
							// Looking for dynamic class
							for( var _iIndex in aClasses ){
								var _oCurrentLibClass = aClasses[ _iIndex ];
								if( _oCurrentLibClass[ _sClass ] ){
									fClass = aClasses[ _iIndex ][ _sClass ];
									break;
								}
							}
							var _oCurrentWidget = new fClass( _aCurrentRow );
							_aLoadedWidgets.push( _oCurrentWidget );
						}
						// Caching results in memory
						_Ancilla.__cacheWidgets( _aLoadedWidgets );
						// Resolving operation
						fResolve();
					})
					.catch(function( oError ){
						_Ancilla.error( '[__cacheSurroundings][Error "%o"] failed to load object class for the following objects: "%o" or relations: "%o" or widget: "%o"', oError, _aObjs, _aRelations, _oWidgets );
						fReject( oError );
					})
				;
			} else {
				this.error( '[__cacheSurroundings] missing surrounding to cache');
			}
		});
	}
*/
	/**
	 * Method used cache objects
	 *
	 * @method    __cacheObjects
	 * @private
	 *
	 * @param	{Object/Array}		obj				The objects to cache
	 *
	 * @return	{Void}
	 *
	 * @example
	 *   Ancilla.__cacheObjects( oObject );
	 */
/*
	__cacheObjects( obj ){
		var _aLoadedObjs = ( Array.isArray( obj ) ? obj : [ obj ] ) ;
		for( var _iIndex in _aLoadedObjs ){
			var _oCurrentObj = _aLoadedObjs[ _iIndex ];
			// Check cached object
			if( this.__oMemoryCache.oObjs[ _oCurrentObj.id ] && this.__oMemoryCache.oLoadedSurroundingsByID[ _oCurrentObj.id ] ){
				this.warn( 'object "%o"(%o) already cached and loaded; ignoring...', _oCurrentObj, _oCurrentObj.id );
			} else {
				this.__oMemoryCache.oObjs[ _oCurrentObj.id ] = _oCurrentObj;
				this.debug( 'cached object "%o"(%o)', _oCurrentObj, _oCurrentObj.id );
			}
		}
	}
*/
	/**
	 * Method used cache relations
	 *
	 * @method    __cacheRelations
	 * @private
	 *
	 * @param	{Object/Array}		relation				The relations to cache
	 *
	 * @return	{Void}
	 *
	 * @example
	 *   Ancilla.__cacheRelations( oRelation );
	 */
/*
	__cacheRelations( relation ){
		var _aLoadedRelations = ( Array.isArray( relation ) ? relation : [ relation ] ) ;
		for( var _iIndex in _aLoadedRelations ){
			var _oCurrentRelation = _aLoadedRelations[ _iIndex ];
			// Check cached relation
			if( typeof this.__oMemoryCache.oRelations[ _oCurrentRelation.id ] == 'undefined' ){
				// Caching relation
				this.__oMemoryCache.oRelations[ _oCurrentRelation.id ] = _oCurrentRelation;
				// Caching access objects by parents
				var _oMatrixByParent = this.getObjsByParent( _oCurrentRelation.parent_id  );
				var _oChildObj = this.getObj( _oCurrentRelation.child_id );
				if( _oChildObj ){
					_oMatrixByParent.push( _oChildObj );
				}
				// Caching access objects by children
				var _oMatrixByChild = this.getObjsByChild( _oCurrentRelation.child_id  );
				var _oParentObj = this.getObj( _oCurrentRelation.parent_id );
				if( _oParentObj ){
					_oMatrixByChild.push( _oParentObj );
				}
				this.debug( 'cached relation ""%o"(%o)', _oCurrentRelation, _oCurrentRelation.id );
			} else {
				this.warn( 'relation "%o"(%o) already cached; ignoring...', _oCurrentRelation, _oCurrentRelation.id );
			}
		}
	}
*/
	/**
	 * Method used cache wdiget
	 *
	 * @method    __cacheWidgets
	 * @private
	 *
	 * @param	{Object/Array}		widget				The widget to cache
	 *
	 * @return	{Void}
	 *
	 * @example
	 *   Ancilla.__cacheWidgets( oWidget );
	 */
/*
	__cacheWidgets( widget ){
		var _aLoadedWidgets = ( Array.isArray( widget ) ? widget : [ widget ] ) ;
		for( var _iIndex in _aLoadedWidgets ){
			var _oCurrentWidget = _aLoadedWidgets[ _iIndex ];
			// Check cached object
			if( this.__oMemoryCache.oWidgets[ _oCurrentWidget.id ] ){
				this.warn( 'widget "%o"(%o) already cached and loaded; ignoring...', _oCurrentWidget, _oCurrentWidget.id );
			} else {
				this.__oMemoryCache.oWidgets[ _oCurrentWidget.id ] = _oCurrentWidget;
				this.debug( 'cached widget "%o"(%o)', _oCurrentWidget, _oCurrentWidget.id );
			}
		}
	}
*/
	/**
	 * Method used get an object from the library
	 *
	 * @method    getObj
	 * @public
	 *
	 * @param	{Number}		iID				The ID of the object
	 *
	 * @return	{Object}	returns the requested object; null if not present
	 *
	 * @example
	 *   Ancilla.getObj( 1 );
	 */
	getObj( iID ){
		return this.__oMemoryCache.oObjs[ iID ];
	}
	/**
	 * Method used get a relation from the library
	 *
	 * @method    getRelation
	 * @public
	 *
	 * @param	{Number}		iID				The ID of the relation
	 *
	 * @return	{Object}	returns the requested relation; null if not present
	 *
	 * @example
	 *   Ancilla.getRelation( 1 );
	 */
	getRelation( iID ){
		return this.__oMemoryCache.oRelations[ iID ];
	}

	/**
	 * Method used get objects from the library by their parent ID
	 *
	 * @method    getObjsByParent
	 * @public
	 *
	 * @param	{Number}		iID				The ID of the parent object
	 *
	 * @return	{Array}	returns an array of objects related as children of the parent
	 *
	 * @example
	 *   Ancilla.getObjsByParent( 1 );
	 */
/*
	getObjsByParent( iID ){
		if( typeof this.__oMemoryCache.oObjsByParents[ iID ] == 'undefined' ){
			this.__oMemoryCache.oObjsByParents[ iID ] = new Array();
		}
		return this.__oMemoryCache.oObjsByParents[ iID ];
	}
*/
	/**
	 * Method used get objects from the library by their child ID
	 *
	 * @method    getObjsByChild
	 * @public
	 *
	 * @param	{Number}		iID				The ID of the child object
	 *
	 * @return	{Array}	returns an array of objects related as parents of the child
	 *
	 * @example
	 *   Ancilla.getObjsByChild( 1 );
	 */
/*
	getObjsByChild( iID ){
		if( typeof this.__oMemoryCache.oObjsByChildren[ iID ] == 'undefined' ){
			this.__oMemoryCache.oObjsByChildren[ iID ] = new Array();
		}
		return this.__oMemoryCache.oObjsByChildren[ iID ];
	}
*/
	/**
	 * Method used get a widget from the library
	 *
	 * @method    getWidget
	 * @public
	 *
	 * @param	{Number}		iID				The ID of the widget
	 *
	 * @return	{Object}	returns the requested widget; null if not present
	 *
	 * @example
	 *   Ancilla.getWidget( 1 );
	 */
	getWidget( iID ){
		return this.__oMemoryCache.oWidgets[ iID ];
	}

	/**
	 * Method used to start Ancilla
	 *
	 * @method    start
	 * @public
	 *
	 * @return	{Object}	returns a Promise successfull when Ancilla is ready or failed when an error occurs
	 *
	 * @example
	 *   Ancilla.start();
	 */
	start(){
		this.info('Starting...');
		// Init WebSocket
		//var _oOptions = this.getOptions();
		var _sWsURL = this.getServerAddress( 'websocket' );
		var _Ancilla = this;
		return this.__initWebSocket( _sWsURL )
			.catch(function(oError){
				_Ancilla.error( '[ Error: %o ] Unable to initialize web socket.', oError );
			})
		;
	}
}

/*
//Polyfills - Object.assign
if( !Object.assign ){
	Object.defineProperty(Object, 'assign', {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function(target, firstSource) {
		  'use strict';
		  if (target === undefined || target === null) {
			throw new TypeError('Cannot convert first argument to object');
		  }

		  var to = Object(target);
		  for (var i = 1; i < arguments.length; i++) {
			var nextSource = arguments[i];
			if (nextSource === undefined || nextSource === null) {
			  continue;
			}

			var keysArray = Object.keys(Object(nextSource));
			for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
			  var nextKey = keysArray[nextIndex];
			  var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
			  if (desc !== undefined && desc.enumerable) {
				to[nextKey] = nextSource[nextKey];
			  }
			}
		  }
		  return to;
		}
	});
}
*/

// Exporting Singleton
const Ancilla = new AncillaClass();
export default Ancilla;
