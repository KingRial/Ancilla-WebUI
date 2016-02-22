import { default as localForage } from 'localForage';
import {CoreLibrary} from 'ancilla:Core.lib';
import { default as Constant } from 'ancilla:Constants';

export class Store extends CoreLibrary {

  constructor( oOptions ){
    oOptions = Object.assign({
      sName: 'GenericStore',
      driver: [ Constant._STORE_INDEXEDDB, Constant._STORE_LOCALSTORAGE, Constant._STORE_WEBSQL ], // An array of drivers or a single driver
      sVersion: Constant._ANCILLA_CORE_VERSION,
      iSize: 4980736, // Size of database, in bytes. WebSQL-only for now.
      sStoreName: ( oOptions.sName ? oOptions.sName : 'Generic_Store' ), // Should be alphanumeric, with underscores.
      sDescription: null
    }, oOptions );
    super({
      sLoggerID: 'Store "' + oOptions.sName + '"'
    });
    //let _Store = this;
    this.debug( 'Creating store %o with following options: %o.', oOptions.sName, oOptions );
    // Creating "LocalForage" instance and returning it
    this.__oStore = localForage.createInstance({
      name: oOptions.sName,
      driver: oOptions.driver,
      version: oOptions.sVersion,
      size: oOptions.iSize,
      storeName: oOptions.sStoreName,
      description: oOptions.sDescription
    });
  }

  getItem( sKey ){
    let _Store = this;
    return this.__oStore.getItem( sKey )
      .then( function( value ){
        _Store.debug( 'Get key %o: %o', sKey, value );
        return value;
      })
      .catch( function( error ){
        _Store.error( 'Error %o: Unable to get key %o', error, sKey );
      })
    ;
  }

  setItem( sKey, value ){
    let _Store = this;
    return this.__oStore.setItem( sKey, value )
      .then( function(){
        _Store.debug( 'Set key %o to %o', sKey, value );
      })
      .catch( function( error ){
        _Store.error( 'Error %o: Unable to set key %o to %o', error, sKey, value );
      })
    ;
  }

  removeItem( sKey ){
    let _Store = this;
    return this.__oStore.removeItem( sKey )
      .then( function(){
        _Store.debug( 'Removed key %o', sKey );
      })
      .catch( function( error ){
        _Store.error( 'Error %o: Unable to remove key %o', error, sKey );
      })
    ;
  }

}
