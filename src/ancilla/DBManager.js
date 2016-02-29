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
    breeze.config.initializeAdapterInstance( 'uriBuilder', 'json' );
    breeze.config.initializeAdapterInstance( 'modelLibrary', 'backingStore' );
    // Building custom Breeze/Ancilla Adapter to use Authenticator class to fetch datas with the correct Authorization
    let _DB = this;
    class BreezeAncillaAdapter {

      constructor(){
        this.name = 'ancilla';
        this.defaultSettings = { };
        this.requestInterceptor = null;
      }

      initialize(){
        // Nothing to do
      }

      ajax( oAjaxConfig ){
        let _oRequestPromise = null;
        switch( oAjaxConfig.type.toLowerCase() ){
          case 'get':
            _oRequestPromise = _DB.__oAuthenticator.get( oAjaxConfig.url );
          break;
          case 'post':
            _oRequestPromise = _DB.__oAuthenticator.post( oAjaxConfig.url );
          break;
          default:
            // Nothing to do
          break;
        }
        _oRequestPromise
          .then(function( oResponse ){
            return oResponse.json()
              .then( function( oResponseBody ){
                let _oResponse = {
                  config: oAjaxConfig,
                  httpResponse: oResponse,
                  status: oResponse.status,
                  data: oResponseBody,
                  headers: oResponse.headers,
                };
                oAjaxConfig.success( _oResponse );
              })
            ;
          } )
          .catch( function( oError ){
// TODO: handle error!!! ( http://breeze.github.io/doc-js/server-ajaxadapter.html, http://breeze.github.io/doc-js/server-dataserviceadapter.html#fetchMetadata )
            oAjaxConfig.error( oError );
            /*
            let _oResponse = {
              config: oAjaxConfig,
              httpResponse: oResponse,
              status: oResponse.status,
              data: oResponseBody,
              headers: oResponse.headers,
            };
            oAjaxConfig.error( _oResponse );
            */
          })
        ;
      }
    }
    breeze.config.registerAdapter('ajax', BreezeAncillaAdapter );
    breeze.config.initializeAdapterInstance('ajax', 'ancilla', true);
  }


  getEntityQuery( oJSONQuery ){
    return new breeze.EntityQuery( oJSONQuery );
  }


//SEE http://breeze.github.io/doc-js/query-using-json.html
  query( oJSONQuery, oOptions ){
//manager.exportEntities();importEntities();executeQueryLocally
console.error( 'Should query locally before calling server ' );
    oOptions = Object.assign({
			bParseResponse: true
		}, oOptions );
    let _DBManager = this;
    _DBManager.debug( 'Executing query: %o ...', JSON.stringify( oJSONQuery ) );
// TODO: handle execute locally for future DB caching
    return this.__oDB.executeQuery(  this.getEntityQuery( oJSONQuery )  )
      .then(  function( oData ){
        _DBManager.debug( 'Query %o executed successfully with the following results: %o ( Entity: %o )', JSON.stringify( oJSONQuery ), oData.results[ 0 ], oData );
        if( oOptions.bParseResponse ){
          //let _oStore = oData.entityManager.metadataStore;
          //let _oEntityType = _oStore.getEntityType( oData.query.resourceName );
          let _oEntityType = oData.query.fromEntityType;
          let _aResults = [];
          for( let _iResultIndex=0; _iResultIndex < oData.results.length; _iResultIndex++ ){
            let _oResult = {};
            for( let _iPropertyIndex=0; _iPropertyIndex < _oEntityType.dataProperties.length; _iPropertyIndex++ ){
              let _sProperty = _oEntityType.dataProperties[ _iPropertyIndex ].name;
              let value = oData.results[ _iResultIndex ].getProperty( _sProperty );
              _oResult[ _sProperty ] = value;
            }
            _aResults.push( _oResult );
          }
          return _aResults;
        } else {
          return oData.results[ 0 ];
        }
      })
      .catch( function( oError ){
        _DBManager.error( 'Failed query: %o with error: %o', oJSONQuery, oError );
      })
    ;
  }

}
