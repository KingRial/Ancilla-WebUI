import {CoreViewModel} from '../core/classes/view-model';
import { default as Constant } from 'ancilla:Constants';

export class Homepage extends CoreViewModel{

  constructor(){
    super();
    this.aEnvironments = [];
    this.bLoading = true;
    this.iLoadingOffest = 0;
    this.iLoadingElements = 10;
  }

  activate(){
    // Should load "Favourites" environment before showing something
    let _View = this;
    return this.getObj( Constant._ENVIRONMENT_FAVOURITES_ID )
      .then( function( oObj ){
        _View.aEnvironments.push( oObj );
        return this;
      })
    ;
  }

  attached(){
    return this.loadNextEnvironments();
  }

  loadNextEnvironments(){
    let _View = this;
    _View.bLoading = true;
    _View.getObj({
      and: [
        { id: { '!=': Constant._ENVIRONMENT_FAVOURITES_ID } },
        { type: Constant._OBJECT_TYPE_GROUP }
      ]
    })
      .then( function( aEnvironments ){
        if( aEnvironments ){
          aEnvironments.forEach( function( oEnvironment ){
            _View.aEnvironments.push( oEnvironment );
          });
        }
        _View.bLoading = false;
        return this;
      })
    ;
  }

}
