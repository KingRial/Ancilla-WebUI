import {Redirect} from 'aurelia-router';
import { default as Ancilla } from 'ancilla:Ancilla';
import {CoreViewModel} from './SubApps/core/classes/view-model';
// Generic theme custom libs
//import 'bootstrap';

export class App extends CoreViewModel{
  configureRouter(config, router) {
    this.oRouter = router;
    config.title = Ancilla.getConstant( '_LANG_ANCILLA' );
		config.addPipelineStep( 'authorize', AuthorizeStep );
    config.map([
      { route: [ '', 'runtime' ], name: 'runtime', moduleId: './SubApps/runtime/App',	title: Ancilla.getConstant( '_LANG_RUNTIME' ), nav: true },
      { route: [ 'logout', 'login' ], name: 'login', moduleId: './login',	nav: true,	title: Ancilla.getConstant( '_LANG_LOGOUT' ) }
    ]);
  }
}

// Authorize Router Check
class AuthorizeStep {
  run(navigationInstruction, next) {
    /*
    if( navigationInstruction.getAllInstructions().some(i => i.config.auth) ){
      var isLoggedIn = false;
      if( !isLoggedIn ){
        return next.cancel(new Redirect('login'));
      }
    }
    */
    /*
    navigationInstruction.getAllInstructions().some( function( oElement ){
      console.error( 'Element: %o Config: %o Auth: %o', oElement, oElement.config, ( oElement.config ? oElement.config.auth : null ) );
    } );
    */
    var _bIsNotLoginPage  = navigationInstruction.getAllInstructions().some( element => element.config.moduleId !== './login' );
		if( _bIsNotLoginPage ){
      return Ancilla.isAuthenticated()
        .then( function( bIsAuthenticated ){
          let _oUser = Ancilla.getCurrentUser();
          Ancilla.debug( '[Login Check] %o %s authenticated...', ( _oUser ? _oUser : 'noone' ), ( bIsAuthenticated ? 'is' : 'is NOT' ) );
          if( bIsAuthenticated ){
            return next();
    			} else {
            return next.cancel( new Redirect( 'login' ) );
          }
        })
      ;
		} else {
      return next();
    }
  }
}
