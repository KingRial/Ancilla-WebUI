import { default as localForage } from 'localForage';
import {CoreLibrary} from 'ancilla:Core.lib';
import { default as Constant } from 'ancilla:Constants';

export class Store extends CoreLibrary {

  constructor( oOptions ){
    oOptions = Object.assign({
      sName: 'GenericStore',
      driver: [ Constant._STORE_INDEXEDDB, Constant._STORE_WEBSQL, Constant._STORE_LOCALSTORAGE ], // An array of drivers or a single driver
      sVersion: '1.0', //Constant._ANCILLA_CORE_VERSION, // Cannot use Ancilla Core Version!
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
    let _oStoreOptions = {
      name: oOptions.sName,
      driver: oOptions.driver,
      version: oOptions.sVersion,
      size: oOptions.iSize,
      storeName: oOptions.sStoreName,
      description: oOptions.sDescription
    };
    this.__oStore = localForage.createInstance( _oStoreOptions );
  }

  ready(){
    return this.__oStore.ready();
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

  clear(){
    let _Store = this;
    return this.__oStore.clear()
      .then( function(){
        _Store.debug( 'Cleared store' );
      })
      .catch( function( error ){
        _Store.error( 'Error %o: Unable to clear store', error );
      })
    ;
  }

  iterate( fIteratorCallback ){
    let _Store = this;
    return this.__oStore.iterate( fIteratorCallback )
      .then( function(){
        _Store.debug( 'Iterated over store' );
      })
      .catch( function( error ){
        _Store.error( 'Error %o: Failed to iterate over store', error );
      })
    ;
  }

  key( iKeyIndex ){
    let _Store = this;
    return this.__oStore.key( iKeyIndex )
      .then( function( sKey ){
        _Store.debug( 'Got key %o from index %o', sKey, iKeyIndex );
      })
      .catch( function( error ){
        _Store.error( 'Error %o: Unable to get key from index %o', error, iKeyIndex );
      })
    ;
  }

  keys(){
    let _Store = this;
    return this.__oStore.keys()
      .then( function( aKeys ){
        _Store.debug( 'Got all key\'s store %o', aKeys );
      })
      .catch( function( error ){
        _Store.error( 'Error %o: Unable to get all keys from store', error );
      })
    ;
  }

  length(){
    let _Store = this;
    return this.__oStore.removeItlengthem()
      .then( function( iNumber ){
        _Store.debug( 'Got %o keys in the store', iNumber );
      })
      .catch( function( error ){
        _Store.error( 'Error %o: Unable to get how mnay keys are in the store', error );
      })
    ;
  }

}
