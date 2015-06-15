import {Redirect} from 'aurelia-router';
import {CoreViewModel} from './SubApps/core/core.view-model';
import $ from 'jquery';
import Materialize from 'materialize';
import './CSSs/main.css!';

export class App extends CoreViewModel{

	__bAncillaIsConnected = Ancilla.getStatus( 'bIsConnected' );
	__sServerAddress = Ancilla.getServerAddress();
	__oConfiguredProjects = null;

	activate(){
		this.mirrorObjectProperty( Ancilla.getStatus(), 'bIsConnected', '__bAncillaIsConnected' );
	}

	// Configuring Router
	configureRouter(config, router){
		config.title = Ancilla.getConstant( '_LANG_ANCILLA' );
		config.addPipelineStep( 'authorize', AuthorizeStep );
		config.map([
				{ route: [ '', 'runtime' ], moduleId: './SubApps/runtime/App',	nav: true,	title: Ancilla.getConstant( '_LANG_RUNTIME' ), classCSS: 'mdi-action-home' },
				{ route: 'administration', moduleId: './SubApps/administration/App',	nav: true,	title: Ancilla.getConstant( '_LANG_ADMINISTRATION' ), classCSS: 'mdi-action-settings' },
				{ route: 'developer', moduleId: './SubApps/developer/App',	nav: true,	title: Ancilla.getConstant( '_LANG_DEVELOPER' ), classCSS: 'mdi-device-developer-mode' },
				{ route: [ 'logout', 'login' ], moduleId: './login',	nav: true,	title: Ancilla.getConstant( '_LANG_LOGOUT' ), classCSS: 'mdi-social-person' }
		])
    this.__oRouter = router;
  }
}

// Authorize Router Check
class AuthorizeStep {

	constructor() {
	}

	run( routingContext, next ) {
		var _bIsNotLoginPage  = routingContext.nextInstructions.some( element => element.config.moduleId!='./login' );
		if( _bIsNotLoginPage ){
			var _oUser = Ancilla.getCurrentUser();
			Ancilla.debug( '[Login Check] %o is logged...', ( _oUser ? _oUser : 'noone' ) );
			if( !_oUser ){
				return next.cancel( new Redirect('login') );
			} else{
				return next();
			}
		} else {
			return next();
		}
	}
}
