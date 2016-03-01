import { default as Ancilla } from 'ancilla:Ancilla';
import {CoreViewModel} from '../core/classes/view-model';

// Extending Grid to be able to load objects on activate event
export class App extends CoreViewModel {
	//oRouter = null;
	//oItem = null;

	// Configuring Child Router
	configureRouter(config, router){
		config.title = Ancilla.getConstant( '_LANG_MENU' );
		config.map([
			{ route: [ '', 'homepage' ], moduleId: './homepage',	nav: false, title: Ancilla.getConstant('_LANG_HOMEPAGE') },
			{ route: 'grid/:id/', moduleId: './grid', nav: false, title: Ancilla.getConstant('_LANG_GRID') }
		]);
    this.oRouter = router;
  }

	// TODO: This is needed for navigation.menu; find a way to move this, inside its view
	/*
	activate( oParams, oQueryString, oRouteConfig ){
    var _View = this;
		// TODO: there is a bug in the current Aurelia versione; we are handling ID differently
    //var _iID = parseInt( oParams.id );
		//this.id = ( isNaN( _iID ) ? 4 : _iID ); //TODO: 4 should be "homepage"; should it be a dynamic call somehow ?
		this.id = ( isNaN( oParams.id ) ? parseInt( oParams.childRoute ? oParams.childRoute.replace( 'grid/', '' ) : 4 ) : oParams.id );
    return this.loadObj( this.id )
      .then( function(){
        _View.oItem = Ancilla.getObj( _View.id );
        return this;
      })
    ;
  }
	*/
}
