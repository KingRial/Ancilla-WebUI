import {CoreViewModel} from '../core/core.view-model'
import { default as Constant } from 'ancilla:Constants';

export class Homepage extends CoreViewModel{
  aEnvironments = [];

  activate(){
    // Should load "Favourites" environment before showing something
    var _View = this;
    return this.getObj( Constant._ENVIRONMENT_FAVOURITES_ID )
      .then( function( oObj ){
        _View.aEnvironments.push( oObj );
        return this;
      })
    ;
  }

  attached(){
    this.error( 'SHOULD LOAD ALL GROUPS!' );
  }

}
