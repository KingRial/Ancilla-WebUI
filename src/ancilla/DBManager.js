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
    this.__oDBQueryStore = new Store({
      sName: 'BreezeDB',
      sStoreName: 'QueryHistory',
      sDescription: 'Storing Query History locally'
    });
    this.__oDBBreezeStore = new Store({
      sName: 'BreezeDB',
      sStoreName: 'BreezeCache',
      sDescription: 'Storing Breeze Cache'
    });
    this.__aLatestQueriesDone = [];
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
    let _DBManager = this;
    return this.__oDBQueryStore.ready()
      .then( function(){
        return _DBManager.__oDBBreezeStore.ready();
      })
      .then( function(){
        return _DBManager.cacheInit();
      })
    ;
  }

  cacheInit(){
    let _DBManager = this;
    return this.__oDBBreezeStore.getItem( 'cache' )
      .then( function( sCache ){
        if( sCache ){
          _DBManager.__oDB.importEntities( sCache );
        } else {
          _DBManager.debug( 'No DB caches stored. Local DB is initialized as empty.' );
        }
      })
      .catch( function( oError ){
        _DBManager.error( 'Unable to initialize DB caches. Error: %o', oError );
      })
    ;
  }

  cacheSave(){
    let _DBManager = this;
    // Caching breeze entities
    return this.__oDBBreezeStore.setItem( 'cache' , this.__oDB.exportEntities() )
      .then( function(){
        // Caching latest new query done to the server
        let _aPromises = [];
        for( let _sQuery in _DBManager.__aLatestQueriesDone ){
          if( _DBManager.__aLatestQueriesDone.hasOwnProperty( _sQuery ) ){
            _aPromises.push( _DBManager.__oDBQueryStore.setItem( _sQuery , _DBManager.__aLatestQueriesDone[ _sQuery ] ) );
          }
        }
        return Promise.all( _aPromises );
      })
      .then( function(){
        // Reinit latest queries done
        _DBManager.__aLatestQueriesDone = [];
      })
      .catch( function( oError ){
        _DBManager.error( 'Unable to save DB caches. Error: %o', oError );
      })
    ;
  }

  cacheClear(){
    let _DBManager = this;
    // Caching breeze entities
    return this.__oDBQueryStore.clear()
      .then( function(){
        return _DBManager.__oDBBreezeStore.clear();
      })
    ;
  }

  getEntityQuery( oJSONQuery ){
    //return new breeze.EntityQuery( oJSONQuery ).using( this.__oDB );
    return new breeze.EntityQuery( oJSONQuery );
  }

  fetchMetadata(){
    let _DBManager = this;
    return new Promise( function( fResove, fReject ){
        // Checking if Metadata has already been loaded; if not, fetching it from remote
        if( _DBManager.__oDB.metadataStore.isEmpty() ){
          _DBManager.debug( 'Fetching missing metadata...' );
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
    ;
  }

//SEE http://breeze.github.io/doc-js/query-using-json.html
  query( oJSONQuery, oOptions ){
    oOptions = Object.assign({
			bParseResponse: true,
      bFromCache: false,
      bFromServer: false
		}, oOptions );
    let _DBManager = this;
    let _sQuery = JSON.stringify( oJSONQuery );
    return _DBManager.fetchMetadata()
      // Checking if query can be done locally
      .then( function(){
        return _DBManager.isLocalQuery( _sQuery, oOptions );
      })
      // Executing query
      .then( function( bIsLocalQuery ){
        _DBManager.debug( 'Executing query %o: %o ...', ( bIsLocalQuery ? 'LOCALLY' : 'REMOTLY' ), _sQuery );
        return _DBManager.__oDB.executeQuery(
          _DBManager.getEntityQuery( oJSONQuery )
            .using( ( bIsLocalQuery ? breeze.FetchStrategy.FromLocalCache : breeze.FetchStrategy.FromServer ) )
          )
          .then( function( oData ){
            // Remembering locally this new query has already been asked to the server ( it will be saved later in a persistant store when we save the query manager export too! )
            if( !bIsLocalQuery ){
              _DBManager.__aLatestQueriesDone[ _sQuery ] = true;
            }
            // Returning collected data
            return oData;
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

  isLocalQuery( sQuery, oOptions ){
    oOptions = Object.assign({
      bFromCache: false,
      bFromServer: false
		}, oOptions );
    let _DBManager = this;
    if( oOptions.bFromCache ){
      _DBManager.debug( 'Query %o is FORCED as LOCAL...', sQuery );
      return Promise.resolve( true );
    } else if( oOptions.bFromServer ){
      _DBManager.debug( 'Query %o is FORCED as REMOTE...', sQuery );
      return Promise.resolve( false );
    } else {
      return _DBManager.__oDBQueryStore.getItem( sQuery )
        .then( function( bFound ){
          let _bIsLocalQuery =  ( bFound || _DBManager.__aLatestQueriesDone[ sQuery ] );
          _DBManager.debug( 'Query %o is %o...', sQuery, ( _bIsLocalQuery ? 'LOCAL' : 'REMOTE' ) );
          return _bIsLocalQuery;
        })
      ;
    }
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
