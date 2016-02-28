import {CoreViewModel} from './SubApps/core/core.view-model';

import { default as Ancilla } from 'ancilla:Ancilla';
import { default as Tools} from 'ancilla:Tools';

export class Login extends CoreViewModel{

  constructor(){
    super();
    this.sUsername = '';
    this.sPassword = '';
    this.bRememberMe = true;
  }

  activate( oParams, oRouteConfig){
    if( oRouteConfig.route === 'logout' ){
      let _View = this;
      Ancilla
        .logOut()
        .then( function(){
          return Ancilla.logOut( null );
        })
        .then( function(){
          Tools.windowReload('#/login');
        })
        .catch( function( oError ){
          _View.error( oError, _View.getConstant( '_LANG_ERROR_LOGOUT' ) );
        })
      ;
    }
  }

  login(){
    let _View = this;
    Ancilla.logInAs( this.sUsername, this.sPassword, this.bRememberMe )
      .then(function(){
        Ancilla.info( 'logged as "%o"', ( Ancilla.getCurrentUser() ? Ancilla.getCurrentUser().name : 'noone' ) );
        Tools.windowReload('#/');
      })
      .catch(function( oError ){
        _View.error( oError );
      })
    ;
  }
}
