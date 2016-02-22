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

    breeze.config.initializeAdapterInstance("modelLibrary", "backingStore");

    let _DBManager = this;
    this.query(
      _DBManager.getEntityQuery()
        .from('OBJECTS')
        .where('id', '==', 1)
    );
  }


  getEntityQuery(){
    return new breeze.EntityQuery();
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

  refreshAccessToken(){
    return this.__oAuthenticator.refreshToken();
  }

  query( oEntitQuery ){
    let _DBManager = this;
      this.updateAccessToken()
      .then( function(){
        return _DBManager.__oDB.executeQuery( oEntitQuery );
      })
      .catch( function(){
console.error( 'Failed query' );
        return _DBManager.refreshAccessToken()
          .then( function(){
            console.error( 'Ripeti QUERY ora che è tutto refreshato' );
            return _DBManager.__oDB.executeQuery( oEntitQuery );
          })
        ;
      })
      .then(  function(){
        console.error( 'WOW: ', arguments );
      })
      .catch( function( error ){
        console.error( 'KAPUT: ', error );
      })
    ;
  }

}
