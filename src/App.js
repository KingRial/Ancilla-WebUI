import {Redirect} from 'aurelia-router';
import { default as Ancilla } from 'ancilla:Ancilla';

export class App {
  configureRouter(config, router) {
    this.oRouter = router;
    config.title = Ancilla.getConstant( '_LANG_ANCILLA' );
		config.addPipelineStep( 'authorize', AuthorizeStep );
    config.map([
      { route: [ '', 'runtime' ], name: 'runtime', moduleId: './SubApps/runtime/App',	title: Ancilla.getConstant( '_LANG_RUNTIME' ), nav: true },
      { route: [ 'logout', 'login' ], name: 'login', moduleId: './login',	nav: true,	title: Ancilla.getConstant( '_LANG_LOGIN' ) }
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
    var _bIsNotLoginPage  = navigationInstruction.getAllInstructions().some( element => element.config.moduleId !== './login' );
		if( _bIsNotLoginPage ){
			var _oUser = Ancilla.getCurrentUser();
			Ancilla.debug( '[Login Check] %o is logged...', ( _oUser ? _oUser : 'noone' ) );
			if( !_oUser ){
				return next.cancel( new Redirect( 'login' ) );
			} else{
				return next();
			}
		}
    return next();
  }
}
