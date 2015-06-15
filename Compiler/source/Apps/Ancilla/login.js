import {CoreViewModel} from './SubApps/core/core.view-model';
import { default as Constant } from 'ancilla:Constants';
import {ObjectUser} from 'ancilla:Object.User';

export class Login extends CoreViewModel{

  activate( oParams, oQueryString, oRouteConfig){
    if( oRouteConfig.route == 'logout' ){
      Ancilla
        .trigger({ sType: Constant._EVENT_TYPE_LOGOUT })
        .then( function( oEvent ){
          if( oEvent.getResult() == Constant._NO_ERROR ){
            Ancilla.setCurrentUser( null );
            Tools.windowReload('#/login')
          } else {
            Ancilla.error( 'Error "%o"; unable to logout', oEvent.getResult() );
          }
        })
      ;
    }
  }

  login(){
    var _oUser = new ObjectUser();
    Ancilla
      .trigger({
          sType: Constant._EVENT_TYPE_LOGIN,
          sUsername: this.sUsername,
          sPassword: _oUser.hashPassword( this.sPassword )
      })
      .then( function( oEvent ){
        if( oEvent.getResult() == Constant._NO_ERROR ){
          if( oEvent.oUser ){
            Ancilla.setCurrentUser( oEvent.oUser );
          }
          Ancilla.info( 'logged as "%o"', ( Ancilla.getCurrentUser() ? Ancilla.getCurrentUser().name : 'noone' ) );
          Tools.windowReload('#/')
        } else {
          Ancilla.error( 'Error "%o"; unable to login', oEvent.getResult() );
        }
      })
    ;
  }
}
