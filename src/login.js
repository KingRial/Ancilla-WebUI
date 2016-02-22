import {CoreViewModel} from './SubApps/core/core.view-model';

import { default as Ancilla } from 'ancilla:Ancilla';
import { default as Tools} from 'ancilla:Tools';

export class Login extends CoreViewModel{

  constructor(){
    super();
    this.sUsername = '';
    this.sPassword = '';
    this.bRememberMe = false;
  }

  activate( oParams, oQueryString, oRouteConfig){
    if( oRouteConfig.route === 'logout' ){
      Ancilla
        .logOut()
        .then( function(){
          Ancilla.setCurrentUser( null );
          Tools.windowReload('#/login');
        })
        .catch( function( error ){
// TODO: UI error
          Ancilla.error( 'Error "%o"; unable to logout', error );
        })
      ;
    }
  }

  login(){
    Ancilla.logInAs( this.sUsername, this.sPassword )
      .then(function(){
        Ancilla.info( 'logged as "%o"', ( Ancilla.getCurrentUser() ? Ancilla.getCurrentUser().name : 'noone' ) );
        Tools.windowReload('#/');
      })
      .catch(function( error ){
// TODO: UI error
        Ancilla.error( '%o; unable to login.', error );
      })
    ;
  }
}
