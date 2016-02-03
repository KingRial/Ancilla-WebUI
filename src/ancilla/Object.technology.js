import {ObjectCore} from 'ancilla:Object.Core';

/**
 * A class to describe a generic Ancilla technology object
 *
 * @class	Object
 * @public
 *
 * @param	{Object}		oOptions		Default datas to fill the newly created Ancilla object
 *
 * @return	{Void}
 *
 * @example
 *		new ObjectTechnology( { id: 100 } );
 */
export class ObjectTechnology extends ObjectCore {
  getEndpoints(){
    var _aObjectEndpoints = [];
    /*
    if( this.options && this.options.aArguments ){
      var _aGateways = this.options.aArguments;
      for(var _iIndexGateway in _aGateways ){
        var _aEndpoints = _aGateways[ _iIndexGateway ];
        for(var _iIndexEndpoint in _aEndpoints ){
          var _oEndpoint = new ObjectTechnologyEndpoint( _aEndpoints[ _iIndexEndpoint ] );
          _aObjectEndpoints.push( _oEndpoint );
        }
      }
    }
    */
    return _aObjectEndpoints;
  }

  getListenerEndpoints(){
    var _aObjectListeners = [];
    var _aObjectEndpoints = this.getEndpoints();
    for(var _iIndex=0; _iIndex < _aObjectEndpoints.length; _iIndex++ ){
      var _oEndpoint = _aObjectEndpoints[ _iIndex ];
      if( _oEndpoint.isListener() ){
        _aObjectListeners.push( _oEndpoint );
      }
    }
    return _aObjectListeners;
  }

  getConnectEndpoints(){
    var _aObjectConnects = [];
    var _aObjectEndpoints = this.getEndpoints();
    for(var _iIndex=0; _iIndex < _aObjectEndpoints.length; _iIndex++ ){
      var _oEndpoint = _aObjectEndpoints[ _iIndex ];
      if( !_oEndpoint.isListener() ){
        _aObjectConnects.push( _oEndpoint );
      }
    }
    return _aObjectConnects;
  }
}

/**
 * A class to describe a generic Ancilla technology's endpoint object
 *
 * @class	Object
 * @private
 *
 * @return	{Void}
 *
 * @example
 *		new ObjectTechnologyEndpoint();
 */
 class ObjectTechnologyEndpoint extends ObjectCore {
   getID(){
     return this.id;
   }
   getType(){
     return this.type;
   }

   getConnectionType(){
     return this.connectionType;
   }

   getHost(){
     return this.host;
   }

   getPort(){
     return this.port;
   }

   isListener(){
     return ( this.type==='listen' );
   }

   isConnectedTo( oEndpoint ){
     return (
      this.getType() !== oEndpoint.getType() &&
      this.getConnectionType() === oEndpoint.getConnectionType() &&
      this.getHost() === oEndpoint.getHost() &&
      this.getPort() === oEndpoint.getPort()
    );
   }
 }
