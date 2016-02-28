import breeze from 'breeze';
import {CoreLibrary} from 'ancilla:Core.lib';
import { default as Constant } from 'ancilla:Constants';
import { default as Tools } from 'ancilla:Tools';

export default class DBManager extends CoreLibrary {

  constructor( oOptions ){
    oOptions = Object.assign({
			sLoggerID: 'DBManager',
      sBaseURL: null,
      oAuthenticator: null
		}, oOptions );
    super( oOptions );
    this.__oAuthenticator = oOptions.oAuthenticator;
    this.__sBaseURL = ( oOptions.sBaseURL ? Tools.getProtocol( oOptions.sBaseURL ) + '://' + Tools.getIP( oOptions.sBaseURL ) + ':' + Constant._PORT_SERVER_HTTP + '/' : '' ) + 'breeze';
    this.debug( 'Using base URL "%o" to communicate with the server.', this.__sBaseURL );
    this.__oDB = new breeze.EntityManager( this.__sBaseURL );
// TODO: using fetch library in the Authenticator class, instead of the current AJAX adapter
    breeze.config.initializeAdapterInstance( 'uriBuilder', 'json' );
    breeze.config.initializeAdapterInstance( 'modelLibrary', 'backingStore' );
  }


  getEntityQuery( oJSONQuery ){
    return new breeze.EntityQuery( oJSONQuery );
  }

  updateAccessToken(){
    return this.__oAuthenticator.getAccessToken()
      .then(function( sAccessToken ){
        if( sAccessToken ){
          let _oAdapter = breeze.config.getAdapterInstance( 'ajax' );
          /*
          _oAdapter.defaultSettings = {
            headers: {
                'Hello': 'World',
                'Authorization': 'Bearer ' + sAccessToken
            },
          };
          */
          // Aurelia-breeze uses a different default settings to add Headers
          _oAdapter.defaultHeaders = {
              'Authorization': 'Bearer ' + sAccessToken
          };
        }
      })
    ;
  }

  handleRequest( fRequest ){
    let _DBManager = this;
    return this.updateAccessToken()
      .then( function(){
        return _DBManager.__oAuthenticator.handleRequest( fRequest );
      })
    ;
  }

//SEE http://breeze.github.io/doc-js/query-using-json.html
  query( oJSONQuery ){
    let _DBManager = this;
    _DBManager.debug( 'Executing query: %o ...', JSON.stringify( oJSONQuery ) );
// TODO handle execute locally for future DB caching
    return this.handleRequest( () =>this.__oDB.executeQuery(  this.getEntityQuery( oJSONQuery )  ) )
      .then(  function(){
        console.error( 'Query OK: ', arguments );
      })
      .catch( function( oError ){
        _DBManager.error( 'Failed query: %o with error: %o', oJSONQuery, oError );
      })
    ;
  }

}
