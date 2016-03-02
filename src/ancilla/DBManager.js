import breeze from 'breeze';
import {Store} from 'ancilla:Store';
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
    this._oDBQueryStore = new Store({
      sName: 'BreezeDB',
      sStoreName: 'QueryHistory',
      sDescription: 'Storing Query History locally'
    });
    this.__oAuthenticator = oOptions.oAuthenticator;
    this.__sBaseURL = ( oOptions.sBaseURL ? Tools.getProtocol( oOptions.sBaseURL ) + '://' + Tools.getIP( oOptions.sBaseURL ) + ':' + Constant._PORT_SERVER_HTTP + '/' : '' ) + 'breeze';
    this.debug( 'Using base URL "%o" to communicate with the server.', this.__sBaseURL );
    // Init Breeze
    this.__oDB = new breeze.EntityManager( this.__sBaseURL );
    breeze.config.initializeAdapterInstance( 'uriBuilder', 'json' );
    breeze.config.initializeAdapterInstance( 'modelLibrary', 'backingStore' );
    // Building custom Breeze/Ancilla Adapter to use Authenticator class to fetch datas with the correct Authorization
    let _DB = this;
    //Init Breeze
    breeze.config.setQ(Q);
    let AdapterAjax = breeze.config.getAdapter('ajax', 'jQuery');
    class BreezeAncillaInstanceAdapter extends AdapterAjax {

      constructor(){
        super();
        this.name = 'ancilla';
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
          })
        ;
      }
    }
    breeze.config.registerAdapter('ajax', BreezeAncillaInstanceAdapter );
    breeze.config.initializeAdapterInstance('ajax', 'ancilla', true);
    breeze.config.initializeAdapterInstance('dataService', 'webApi');
  }

  ready(){
    return this._oDBQueryStore.ready();
  }

  getEntityQuery( oJSONQuery ){
    //return new breeze.EntityQuery( oJSONQuery ).using( this.__oDB );
    return new breeze.EntityQuery( oJSONQuery );
  }


//SEE http://breeze.github.io/doc-js/query-using-json.html
  query( oJSONQuery, oOptions ){
//TODO: handling export/import to save DB locally; manager.exportEntities();importEntities();
    oOptions = Object.assign({
			bParseResponse: true
		}, oOptions );
    let _DBManager = this;
    let _sQuery = JSON.stringify( oJSONQuery );
    return new Promise( function( fResove, fReject ){
        if( _DBManager.__oDB.metadataStore.isEmpty() ){
          _DBManager.debug( 'Fetching metadata before executing query: %o ...', _sQuery );
          _DBManager.__oDB.fetchMetadata()
            .then(function(){
              fResove();
            })
            .catch(function( oError ){
              fReject( oError );
            })
          ;
        } else {
          fResove();
        }
      })
      .then( function(){
        // Checking if query can be done locally
        return _DBManager._oDBQueryStore.getItem( _sQuery )
          .then( function( bFound ){
            if( bFound ){
              _DBManager.debug( 'Executing query LOCALLY: %o ...', _sQuery );
              return _DBManager.__oDB.executeQuery(
                _DBManager.getEntityQuery( oJSONQuery )
                  .using( breeze.FetchStrategy.FromLocalCache )
              );
            } else {
              _DBManager.debug( 'Executing query SERVER: %o ...', _sQuery );
              return _DBManager.__oDB.executeQuery(
                _DBManager.getEntityQuery( oJSONQuery )
                  .using( breeze.FetchStrategy.FromServer )
              );
            }
          })
        ;
      })
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
        throw oError;
      })
    ;
  }

}

class Q {
  static defer() {
    return new Deferred();
  }

  static resolve(data) {
    return Promise.resolve(data);
  }

  static reject(reason) {
    return Promise.reject(reason);
  }
}

export class Deferred {
  constructor() {
    let self = this;
    this.promise = new Promise(
      function(resolve, reject) {
        self.resolve = resolve;
        self.reject = reject;
      });
  }
}
