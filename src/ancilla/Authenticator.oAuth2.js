import 'fetch';
import {Store} from 'ancilla:Store';
import {CoreLibrary} from 'ancilla:Core.lib';
import { default as Constant } from 'ancilla:Constants';
import { default as Tools } from 'ancilla:Tools';

export default class AuthenticatorOAuth2 extends CoreLibrary {

  constructor( oOptions ){
    oOptions = Object.assign({
			sLoggerID: 'Authenticator.oAuth2'
		}, oOptions );
    super( oOptions );
    // Storing oAuth Tokens
    this._oAuthStore = new Store({
      sName: 'oAuth2',
      driver: Constant._STORE_LOCALSTORAGE,
      sDescription: 'Storing oAuth Tokens'
    });
    this.__sBaseURL = ( oOptions.sBaseURL ? Tools.getProtocol( oOptions.sBaseURL ) + '://' + Tools.getIP( oOptions.sBaseURL ) + ':' + Constant._PORT_SERVER_HTTP : '' );
    this.debug( 'Using base URL "%o" to communicate with the server.', this.__sBaseURL );
  }

  getAccessToken(){
    return this._oAuthStore.getItem( 'sAccessToken' );
  }

  getRefreshToken(){
    return this._oAuthStore.getItem( 'sRefreshToken' );
  }

  getTokenType(){
    return this._oAuthStore.getItem( 'sTokenType' );
  }

  setAccessToken( sToken ){
    return this._oAuthStore.setItem( 'sAccessToken', sToken );
  }

  setRefreshToken( sToken ){
    return this._oAuthStore.setItem( 'sRefreshToken', sToken );
  }

  setTokenType( sTokenType ){
    return this._oAuthStore.setItem( 'sTokenType', sTokenType );
  }

  isAuthenticated(){
    return this.getAccessToken()
      .then( function( sAccessToken ){
        return ( sAccessToken ? true : false );
      })
    ;
  }

  __parseFetchBodyRequest( oRequest ){
    let _sContentType = oRequest.headers[ 'Content-Type' ].split( ';' )[ 0 ];
    switch( _sContentType ){
      case 'application/json':
        oRequest.body = ( typeof oRequest.body === 'object' ? JSON.stringify( oRequest.body ) : oRequest.body );
      break;
      case 'application/x-www-form-urlencoded':
        oRequest.body = this.__parseFetchBodyRequestToFormURLEncode( oRequest.body );
      break;
      default:
        // Nothing to do
      break;
    }
    return oRequest;
  }

  __parseFetchBodyRequestToFormURLEncode( body, oOptions ){
    oOptions = Object.assign({}, oOptions );
    function encode( value ){
      return String( value )
        .replace(/[^ !'()~\*]*/g, encodeURIComponent)
        .replace(/ /g, '+')
        .replace(/[!'()~\*]/g, function (ch) {
          return '%' + ch.charCodeAt().toString(16).slice(-2).toUpperCase();
        });
    }
    function keys( oObj ){
      var _aKeys = Object.keys( oObj );
      return oOptions.bSorted ? _aKeys.sort() : _aKeys;
    }
    function filterjoin( aArray ){
      return aArray.filter( function(e){
          return e;
        })
        .join('&')
      ;
    }
    function objnest( sName, oObject ){
      return filterjoin( keys( oObject ).map(function( key ){
        return nest( sName + '[' + key + ']', oObject[ key ] );
      }) );
    }
    function arrnest( sName, aArray ){
      return filterjoin( aArray.map(function( elem ){
        return nest( sName + '[]', elem );
      }));
    }
    function nest( sName, value ){
      let _sType = typeof value;
      let _sResult = null;
      if( value === _sResult ){
        _sResult = oOptions.bIgnorenull ? _sResult : encode( sName ) + '=' + _sResult;
      } else if( /string|number|boolean/.test( _sType ) ){
        _sResult = encode( sName ) + '=' + encode( value );
      } else if( Array.isArray(value) ){
        _sResult = arrnest( sName, value);
      } else if ( _sType === 'object' ){
        _sResult = objnest( sName, value );
      }
      return _sResult;
    }
    return filterjoin( keys( body ).map( function( key ){
      return nest( key, body[ key ] );
    }));
  }
/*
  __parseFetchBodyReponse( oResponse ){
    let _sContentType = oResponse.headers[ 'Content-Type' ].split( ';' )[ 0 ];
    switch( _sContentType ){
      case 'application/json':
        //oOptions.body = ( typeof oOptions.body === 'object' ? JSON.stringify( oOptions.body ) : oOptions.body );
        return oResponse.body().json()
          .then(function(){

          })
        ;
      break;
      default:
        // Nothing to do
        return oResponse;
      break;
    }
  }
*/
  fetch( sURL, oOptions ){
    let _Authenticator = this;
    oOptions = Object.assign({
      method: 'POST',
      //credentials: 'include', // CORS and Cookies
      //mode: 'cors',
      //redirect: 'follow',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }, oOptions );
    oOptions = this.__parseFetchBodyRequest( oOptions );
    _Authenticator.debug( 'Fetching: %o with options: %o', sURL, oOptions );
    return fetch( this.__sBaseURL + sURL, oOptions )
      .then( function( oResponse ){ // Handling errors
        if( oResponse.status >= 200 && oResponse.status < 300 ){
          //return this.__parseFetchBodyReponse( oResponse );
          return oResponse;
        } else {
          return oResponse.text()
            .then(function( sText ){
              let _oError = new Error( oResponse.statusText + ': ' + sText  );
              _oError.response = oResponse;
              throw _oError;
            })
          ;
        }
      })
      .catch( function( oError ){
        _Authenticator.error( '%o. Failed to fetch %o with following options: %o', oError, sURL, oOptions );
        return Promise.reject( oError );
      } )
    ;
  }

  post( sURL, oOptions ){
    // Forcing method
    oOptions = Object.assign( oOptions, {
      method: 'POST'
    } );
    return this.fetch( sURL, oOptions );
  }

  get( sURL, oOptions ){
    // Forcing method
    oOptions = Object.assign( oOptions, {
      method: 'GET'
    } );
    return this.fetch( sURL, oOptions );
  }

  logInAs( sUsername, sPassword ){
    let _Authenticator = this;
    return this.post( '/oauth/token', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // Current oAuth server requires such Content-Type
        },
        body: {
          grant_type: 'password',
          username: sUsername,
          password: sPassword,
          client_id: Constant._OAUTH_CLIENT_ID,
          client_secret: Constant._OAUTH_CLIENT_SECRET
      	}
      })
      .then( function( oResponse ){
        return oResponse.json()
          .then( function( oResponseBody ){
              _Authenticator.setAccessToken( oResponseBody.access_token );
              _Authenticator.setRefreshToken( oResponseBody.refresh_token );
              _Authenticator.setTokenType( oResponseBody.token_type );
          })
        ;
      })
    ;
  }

  logOut(){
    // TODO:
    console.error( 'TODO logout' );
  }
}
