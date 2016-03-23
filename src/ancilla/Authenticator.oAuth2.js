import 'fetch';
import {Store} from 'ancilla:Store';
import {CoreLibrary} from 'ancilla:Core.lib';
import { default as Constant } from 'ancilla:Constants';
import { AncillaError } from 'ancilla:Error';
import { default as Tools } from 'ancilla:Tools';

export default class AuthenticatorOAuth2 extends CoreLibrary {

  constructor( oOptions ){
    oOptions = Object.assign({
			sLoggerID: 'Authenticator.oAuth2',
      onLoggingOut: null,
		}, oOptions );
    super( oOptions );
    // Storing oAuth Tokens
    this._oAuthStore = new Store({
      sName: 'oAuth2',
      sStoreName: 'Token',
      driver: Constant._STORE_LOCALSTORAGE,
      sDescription: 'Storing oAuth Tokens'
    });
    this.__bRememberMe = null;
    this.__oToken = {};
    this.__sBaseURL = ( oOptions.sBaseURL ? Tools.getProtocol( oOptions.sBaseURL ) + '://' + Tools.getIP( oOptions.sBaseURL ) + ':' + Constant._PORT_SERVER_HTTP : '' );
    this.debug( 'Using base URL "%o" to communicate with the server.', this.__sBaseURL );
  }

  ready(){
    return this._oAuthStore.ready();
  }

  getClientID(){
// TODO: these should be configurable by advanced users
    return Constant._OAUTH_CLIENT_ID;
  }

  getClientSecret(){
// TODO: these should be configurable by advanced users
    return Constant._OAUTH_CLIENT_SECRET;
  }

  getAccessToken(){
    return ( this.__oToken.sAccessToken ? Promise.resolve( this.__oToken.sAccessToken ) : this._oAuthStore.getItem( 'sAccessToken' ) );
  }

  getRefreshToken(){
    return ( this.__oToken.sRefreshToken ? Promise.resolve( this.__oToken.sRefreshToken ) : this._oAuthStore.getItem( 'sRefreshToken' ) );
  }

  getTokenType(){
    return ( this.__oToken.sTokenType ? Promise.resolve( this.__oToken.sTokenType ) :  this._oAuthStore.getItem( 'sTokenType' ) );
  }

  setAccessToken( sToken, bStore ){
    // Storing by default otherwise using argument or global remeber me stored by login procedure
    bStore = ( typeof bStore === 'undefined' ? ( typeof this.__bRememberMe === 'undefined' ? true : this.__bRememberMe ): bStore );
    let _Authenticator = this;
    return ( bStore ? this._oAuthStore.setItem( 'sAccessToken', sToken ) : Promise.resolve() )
      .then(function(){
        _Authenticator.debug( '%s Access Token: %o', ( bStore ? 'Stored' : 'Set' ), sToken );
        _Authenticator.__oToken.sAccessToken = sToken;
      })
    ;
  }

  setRefreshToken( sToken, bStore ){
    // Storing by default otherwise using argument or global remeber me stored by login procedure
    bStore = ( typeof bStore === 'undefined' ? ( typeof this.__bRememberMe === 'undefined' ? true : this.__bRememberMe ): bStore );
    let _Authenticator = this;
    return ( bStore ? this._oAuthStore.setItem( 'sRefreshToken', sToken ) : Promise.resolve() )
      .then(function(){
        _Authenticator.debug( '%s Refresh Token: %o', ( bStore ? 'Stored' : 'Set' ), sToken );
        _Authenticator.__oToken.sRefreshToken = sToken;
      })
    ;
  }

  setTokenType( sTokenType, bStore ){
    // Storing by default otherwise using argument or global remeber me stored by login procedure
    bStore = ( typeof bStore === 'undefined' ? ( typeof this.__bRememberMe === 'undefined' ? true : this.__bRememberMe ): bStore );
    let _Authenticator = this;
    return ( bStore ? this._oAuthStore.setItem( 'sTokenType', sTokenType ) : Promise.resolve() )
      .then(function(){
        _Authenticator.debug( '%s Token type: %o', ( bStore ? 'Stored' : 'Set' ), sTokenType );
        _Authenticator.__oToken.sTokenType = sTokenType;
      })
    ;
  }

  removeAccessToken(){
    delete this.__oToken.sAccessToken;
    return this._oAuthStore.removeItem( 'sAccessToken' );
  }

  removeRefreshToken(){
    delete this.__oToken.sRefreshToken;
    return this._oAuthStore.removeItem( 'sRefreshToken' );
  }

  removeTokenType(){
    delete this.__oToken.sTokenType;
    return this._oAuthStore.removeItem( 'sTokenType' );
  }

  clearTokens(){
    let _Authenticator = this;
    return this.removeAccessToken()
      .then( function(){
        return _Authenticator.removeRefreshToken();
      })
      .then( function(){
        return _Authenticator.removeTokenType();
      })
    ;
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
    let _newBody = null;
    switch( _sContentType ){
      case 'application/json':
        _newBody = ( typeof oRequest.body === 'object' ? JSON.stringify( oRequest.body ) : oRequest.body );
      break;
      case 'application/x-www-form-urlencoded':
        _newBody = this.__parseFetchBodyRequestToFormURLEncode( oRequest.body );
      break;
      default:
        // Nothing to do
        _newBody = oRequest.body;
      break;
    }
    this.debug( 'Parsed body request %o to %o', oRequest.body, _newBody );
    oRequest.body = _newBody;
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
    return this.getTokenType()
      .then( function( sTokenType ){
        return _Authenticator.getAccessToken()
          .then( function( sAccessToken ){
            return ( sTokenType && sAccessToken ? sTokenType.charAt(0).toUpperCase() + sTokenType.slice(1) + ' ' + sAccessToken : null );
          })
        ;
      })
      .then( function( sAuthorization ){
        oOptions = Object.assign({
          method: 'POST',
          //credentials: 'include', // CORS and Cookies
          //mode: 'cors',
          //redirect: 'follow',
          headers: {
            'Authorization': sAuthorization,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }, oOptions );
        oOptions = _Authenticator.__parseFetchBodyRequest( oOptions );
        sURL = ( Tools.isAbsoluteURL( sURL ) ? sURL : _Authenticator.__sBaseURL + sURL );
        _Authenticator.debug( 'Fetching: %o with options: %o', sURL, oOptions );
        return fetch( sURL, oOptions )
          .then( function( oResponse ){ // Handling errors
            if( oResponse.status >= 200 && oResponse.status < 300 ){
              //return _Authenticator.__parseFetchBodyReponse( oResponse );
              return oResponse;
            } else {
              return oResponse.text()
                .then(function( sText ){
                  //let _oError = new Error( oResponse.status, oResponse.statusText + ': ' + sText  );
                  //_oError.response = oResponse;
                  //throw _oError;
                  throw new AncillaError( oResponse.status, oResponse.statusText + ': ' + sText  );
                })
              ;
            }
          })
        ;
      })
      .catch( function( oError ){
        _Authenticator.error( '%o. Failed to fetch %o with following options: %o', oError, sURL, oOptions );
        return Promise.reject( oError );
      } )
    ;
  }

  post( sURL, oOptions ){
    // Forcing method
    oOptions = Object.assign( oOptions || {}, {
      method: 'POST'
    } );
    return this.handleRequest( () => this.fetch( sURL, oOptions ) );
  }

  get( sURL, oOptions ){
    // Forcing method
    oOptions = Object.assign( oOptions || {}, {
      method: 'GET'
    } );
    return this.handleRequest( () => this.fetch( sURL, oOptions ) );
  }

  handleRequest( fRequest ){
    let _Authenticator = this;
    return fRequest()
      .catch( function( oError ){
        _Authenticator.warn( 'Request failed ( %o ); trying to get a refreshed access token...', oError );
        return _Authenticator.refreshToken( oError )
          .then( function(){
            return fRequest()
              .catch( function( oError ){
                _Authenticator.error( 'Failed request with error: %o', oError );
              })
            ;
          })
          .catch( function( oError ){
            _Authenticator.error( 'Failed to get a refreshed access token ( %o ); logging out application...', oError );
            return _Authenticator.logOut()
              .then(function(){
console.error('---------------->TESTING _Authenticator redirect: ', _Authenticator.__oOptions );
                if( _Authenticator.__oOptions.onLoggingOut ){
                  _Authenticator.__oOptions.onLoggingOut( oError );
                }
                throw oError;
              })
            ;
          })
        ;
      })
    ;
  }

  logInAs( sUsername, sPassword, bRememberMe ){
    this.__bRememberMe = bRememberMe;
    let _Authenticator = this;
    // Using fetch instead of "post" because we don't want to start another refreshToken request if this call fails
    return this.fetch( '/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // Current oAuth server requires such Content-Type
        },
        body: {
          grant_type: 'password',
          username: sUsername,
          password: sPassword,
          client_id: _Authenticator.getClientID(),
          client_secret: _Authenticator.getClientSecret()
      	}
      })
      .then( function( oResponse ){
        return oResponse.json()
          .then( function( oResponseBody ){
            return Promise.all( [
              _Authenticator.setAccessToken( oResponseBody.access_token, bRememberMe ),
              _Authenticator.setRefreshToken( oResponseBody.refresh_token, bRememberMe ),
              _Authenticator.setTokenType( oResponseBody.token_type, bRememberMe )
            ] );
          })
        ;
      })
      .catch( function( oError ){
        throw new AncillaError( Constant._ERROR_FAILED_LOGIN, oError.toString() );
      })
    ;
  }

  refreshToken(){
    let _Authenticator = this;
    return this.getRefreshToken()
      .then( function( sRefreshToken ){
        if( sRefreshToken ){
          // Using fetch instead of "post" because we don't want to start another refreshToken request if this call fails
          return _Authenticator.fetch( '/oauth/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded' // Current oAuth server requires such Content-Type
            },
            body: {
              grant_type: 'refresh_token',
              refresh_token: sRefreshToken,
              client_id: _Authenticator.getClientID(),
              client_secret: _Authenticator.getClientSecret()
          	}
          });
        } else {
          new AncillaError( Constant._ERROR_FAILED_OAUTH_REFRESH, 'No refresh token set' );
        }
      })
      .then( function( oResponse ){
        return oResponse.json()
          .then( function( oResponseBody ){
            return Promise.all( [
              _Authenticator.setAccessToken( oResponseBody.access_token ),
              _Authenticator.setRefreshToken( oResponseBody.refresh_token )
            ] );
          })
        ;
      })
      .catch( function( oError ){
        throw new AncillaError( Constant._ERROR_FAILED_OAUTH_REFRESH, oError.toString() );
      })
    ;
  }

  logOut(){
//TODO: should jump to logout page too if not present...
      return this.clearTokens();
  }
}
