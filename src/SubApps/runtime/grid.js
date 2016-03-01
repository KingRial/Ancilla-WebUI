import {CoreViewModel} from '../core/classes/view-model'
import { default as Constant } from 'ancilla:Constants';

export class Grid extends CoreViewModel{
  activate( oParams, oQueryString, oRouteConfig ){
    var _View = this;
    var _iID = parseInt( oParams.id );
    this.id = ( isNaN( _iID ) ? 4 : _iID ); //TODO: 4 should be "homepage"; should it be a dynamic call somehow ?
    return this.loadObj( this.id )
      .then( function(){
        _View.__oLoadedObj = Ancilla.getObj( _View.id );
        return this;
      })
    ;
  }
}
