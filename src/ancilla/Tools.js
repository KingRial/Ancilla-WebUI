import {CoreLibrary} from 'ancilla:Core.lib';

/**
 * A class to describe a generic Ancilla tool object
 *
 * @class	Tools
 * @public
 *
 * @return	{Void}
 *
 * @example
 *		new Tools();
 */
export class ToolsClass extends CoreLibrary {

  constructor(){
		// Calling Super Constructor
		super( {
      sLoggerID: 'Tools'
    } );
	}

  getProtocol( sURL ){
		if( !sURL ){
			sURL = document.URL;
		}
		var _aIPAddressTokens = sURL.split('://');
		return ( _aIPAddressTokens.length > 1 ? _aIPAddressTokens[0] : 'http' );
	}

	getIP( sURL ){
		if( !sURL ){
			sURL = document.URL;
		}
		var _sProtocol = this.getProtocol( sURL );
		if( _sProtocol ){
			sURL = sURL.replace( new RegExp( _sProtocol + '://' ), '' );
		}
		var _aIPAddressTokens = sURL.replace(new RegExp(/\\\\/g),'/').split('/');
		return ( _aIPAddressTokens[0].indexOf('@')!==-1 ? _aIPAddressTokens[0].split('@')[1].split(':')[0] : _aIPAddressTokens[0].split(':')[0] );
	}

	getSWName( sURL ){
		if( !sURL ){
			sURL = document.URL;
		}
		var _sProtocol = this.getProtocol( sURL );
		if( _sProtocol ){
			sURL = sURL.replace(new RegExp(_sProtocol + '://'),'');
		}
		var _aIPAddressTokens = sURL.replace(new RegExp(/\\\\/g),'/').split('/');
		return ( _aIPAddressTokens[1] ? _aIPAddressTokens[1] : '' );
	}

	getCredentials( sURL ){
		if( !sURL ){
			sURL = document.URL;
		}
		var _sProtocol = this.getProtocol( sURL );
		if( _sProtocol ){
			sURL = sURL.replace(new RegExp(_sProtocol + '://'),'');
		}
		var _aIPAddressTokens = sURL.replace(new RegExp(/\\\\/g),'/').split('/');
		return ( _aIPAddressTokens[0].indexOf('@')!==-1 ? _aIPAddressTokens[0].split('@')[0] + '@' : '' );
	}

	getPort( sURL ){
		if( !sURL ){
			sURL = document.URL;
		}
		var _sProtocol = this.getProtocol( sURL );
		if( _sProtocol ){
			sURL = sURL.replace(new RegExp(_sProtocol + '://'),'');
		}
		var _aIPAddressTokens = sURL.replace(new RegExp(/\\\\/g),'/').split('/');
		var _iSplitIndex = ( this.getCredentials( sURL ) ? 2 : 1 );
		return ( _aIPAddressTokens[0].split(':')[ _iSplitIndex ] );
	}

	isAbsoluteURL( sURL ){
		return /^(?:\/|[a-z]+:\/\/)/.test( sURL );
	}

	qualifyURL( sBaseURL, sRelativeURL ){
		var _aStack = sBaseURL.split('/'),
		_aParts = sRelativeURL.split('/');
		_aStack.pop(); // remove current file name (or empty string)
		// (omit if "sBaseURL" is the current folder without trailing slash)
		for( var _iIndex=0; _iIndex<_aParts.length; _iIndex++ ){
			if ( _aParts[ _iIndex ] === '.'){
				continue;
			}
			if ( _aParts[ _iIndex ] === '..'){
				_aStack.pop();
			} else {
			_aStack.push( _aParts[ _iIndex ] );
			}
		}
		return _aStack.join('/');
	}

  CIDRCheckOnIP( sIP, sCIDR ){
		var _aCIDR = sCIDR.split('/');
		var _aIP = sIP.split('.');
		//var _sBase = _aCIDR[0];
		var _aBase = _aCIDR[0].split('.');
		var _iBits = parseInt(_aCIDR[1]);
		var _iA = parseInt(_aBase[0]);
		var _iB = parseInt(_aBase[1]);
		var _iC = parseInt(_aBase[2]);
		var _iD = parseInt(_aBase[3]);
		var _biTmp = (_iA << 24)+(_iB << 16) + (_iC << 8) + _iD;
		var _biMask = (_iBits === 0?0:(~0 << (32 - _iBits)));
		var _biLow = _biTmp & _biMask;
		var _biHigh = _biTmp | (~_biMask & 0xFFFFFFFF);
		_iA = parseInt(_aIP[0]);
		_iB = parseInt(_aIP[1]);
		_iC = parseInt(_aIP[2]);
		_iD = parseInt(_aIP[3]);
		var _biCheck = (_iA << 24) + (_iB << 16) + ( _iC << 8 ) + _iD;
		return (sIP && sCIDR && (_biCheck >= _biLow && _biCheck <= _biHigh) ? true : false );
	}

	IPisPublic( sIP ){
    // Checking standard local networks (http://en.wikipedia.org/wiki/Private_network)
		var _bIsPublic = (
				(
					( sIP==='locahost' ) ||
					( sIP==='127.0.0.1' ) ||
					this.CIDRCheckOnIP( sIP, '10.0.0.0/8' ) ||
					this.CIDRCheckOnIP( sIP, '172.16.0.0/12' ) ||
					this.CIDRCheckOnIP( sIP, '192.168.0.0/16' )
				) ? false : true );
		return _bIsPublic;
	}

  getUserAgent(){
		return navigator.userAgent.toLowerCase();
	}

  getBrowserVersion(userAgent){
		if( !userAgent ){
			userAgent = this.getUserAgent();
		}
		return userAgent.match( new RegExp(/(android|opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i) )[2];
	}

  getBrowserPixelRatio(){
		return window.devicePixelRatio;
	}

  __isTypeMobileBrowser(userAgent,sField,sRegTest){
		var bResult = false;
		if( !userAgent ){
			userAgent = this.getBrowserUserAgent();
		}
    bResult = ( new RegExp( sRegTest ).test( userAgent ) );
		return bResult;
	}

	isChromeBrowser(userAgent){
		return this.__isTypeMobileBrowser( userAgent, 'isChrome', 'chrome' );
	}

	isFirefoxBrowser(userAgent){
		var bResult = false;
		if( !userAgent ){
			userAgent = this.getBrowserUserAgent();
		}
		bResult = (/mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent) && !this.isAppleMobileBrowser());
		return bResult;
	}

	isSafariBrowser(userAgent){
		var bResult = false;
		if( !userAgent ){
			userAgent = this.getBrowserUserAgent();
		}
		bResult = (/webkit/.test(userAgent) && !/chrome/.test(userAgent) && !this.isAppleMobileBrowser());
		return bResult;
	}

	isAndroidMobileBrowser(userAgent){
		return this.__isTypeMobileBrowser( userAgent, 'isAndroid', 'android' );
	}

	isIPhoneMobileBrowser(userAgent){
		return this.__isTypeMobileBrowser( userAgent, 'isIPhone', 'iphone' );
	}

	isIPadMobileBrowser(userAgent){
		return this.__isTypeMobileBrowser( userAgent, 'isIPad', 'ipad' );
	}

	isIPodMobileBrowser(userAgent){
		return this.__isTypeMobileBrowser( userAgent, 'isIPod', 'ipod' );
	}

	isAppleMobileBrowser(userAgent){
		var bResult = (
			this.isIPhoneMobileBrowser(userAgent) ||
			this.isIPadMobileBrowser(userAgent) ||
			this.isIPodMobileBrowser(userAgent)
		);
		return bResult;
	}

	isMobileBrowser(userAgent){
		var bResult = ( this.isAppleMobileBrowser(userAgent) || this.isAndroidMobileBrowser(userAgent) );
		return bResult;
	}

	isIEBrowser(userAgent){
		var bResult = false;
		if( !userAgent ){
			userAgent = this.getBrowserUserAgent();
		}
		bResult = (/msie/.test(userAgent) && !/opera/.test(userAgent) && !this.isAppleMobileBrowser());
		return bResult;
	}

  getClientTime( oOptions ){
    oOptions = Object.assign({
      sFormat: 'milliseconds',
      bIgnoreTimezone: true
		}, oOptions );
		var _iScale = null;
		var _sDate = new Date();
		switch( oOptions.sFormat ){
			case 'seconds':
				_iScale = 1000;
			break;
			case 'milliseconds':
        _iScale = 1;
      break;
			default:
				_iScale = 1;
			break;
		}
		return Math.round( ( _sDate.getTime() + ( oOptions.bIgnoreTimezone ? 0 : (-1) * _sDate.getTimezoneOffset() * 60000 ) ) / _iScale );
	}

  windowReload( sURL ){
    if( sURL ){
      window.location.href= sURL;
    } else {
      window.reload();
    }
  }

  /*
  import( aLibsToImport ){
    var _Tools = this;
    var _aImportPromises = [];
    _Tools.debug( 'loading libraries: %o', aLibsToImport );
    for( var _iIndex=0; _iIndex<aLibsToImport.length; _iIndex++ ){
        var _oPromiseToLoad = System.import( aLibsToImport[ _iIndex ] );
        _oPromiseToLoad
          .catch( function( oError ){
            _Tools.error( '[ Error ] %o', oError );
          })
        ;
        _aImportPromises.push( _oPromiseToLoad );
    }
    return Promise.all( _aImportPromises );
  }
  */

  /*
  hex2RGB( sHex ){
		//sHex should be #rrggbb
		var _iHex = parseInt( sHex.substring(1), 16 );
		var _iRed = ( _iHex & 0xff0000) >> 16;
		var _iGreen = ( _iHex & 0x00ff00) >> 8;
		var _iBlue = _iHex & 0x0000ff;
		return [ _iRed, _iGreen, _iBlue ];
	}

	RGB2Hex( sRGBString ){
		sRGBString = sRGBString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  }
  */

/*
  trim( sString ){
		return sString.replace(/^\s+|\s+$/g,'');
	}

  this.XML=function(XML){
		var tmp=XML;
		return new function(tmp){
			try{
				var _bIsString = ( typeof XML=='string' );
				//Trimming value to let jQuery handle correctly HTML string like $('   <div></div>') without errors or using jQuery migrate function
				if( _bIsString ){
					XML = $.trim(XML);
				}
				this._oXml=$(( _bIsString && $.isXMLDoc(XML) ? $.parseXML(XML) : XML ));
			}catch(e){
				this._oXml=null;
			}
			this.get=function(value){
				var result = ( this._oXml ? this._oXml.find(value).text() : null );
				return ( ( isNaN(result) || result=='' ) ? result : parseFloat(result) );
			}
			this.set=function(sKey,value){
				this._oXml.find(sKey).text( value );
			}
			this.toString=function(){
				var _sXML = '';
				//IE
				if ( window.ActiveXObject ){
					_sXML = XML.xml;
				} else {
					_sXML = ( new XMLSerializer() ).serializeToString( XML );
				}
				return _sXML;
			}
		}
	}


	* pad a string
	* @function pad a string
	* @param {String} str string to be padded
	* @param {Number} [Optional] len pad length; if not used it's set to 0
	* @param {String/Number} [Optional] pad string to use as pad; if not used it's set to ' ' (space character)
	* @param {Number} [Optional] dir direction to pad (1:Left,2:Right,3:Both); if not used it's set to Left
	* @returns {String} padded string

	this.strPad=function(str,len,pad,dir){
		var STR_PAD_LEFT=1;
		var STR_PAD_RIGHT=2;
		var STR_PAD_BOTH=3;
		str=''+str;
		if(typeof(len)=="undefined"){var len=0;}
		if(typeof(pad)=="undefined"){var pad=' ';}
		pad=''+pad;
		if(typeof(dir)=="undefined"){var dir=STR_PAD_LEFT;}
		if(len+1>=str.length){
			switch (dir){
				default:
				case STR_PAD_LEFT:
					str=Array(len+1-str.length).join(pad)+str;
				break;
				case STR_PAD_BOTH:
					var right=Math.ceil((padlen = len - str.length)/2);
					var left=padlen-right;
					str=Array(left+1).join(pad)+str+Array(right+1).join(pad);
				break;
				case STR_PAD_RIGHT:
					str=str+Array(len+1-str.length).join(pad);
				break;
			}
		}
		return str;
	}

  includeCSS(sPath){
  		$('head')
  			.find('link')
  			.last()
  			.after(
  				$('<link/>',{
  					rel: 'stylesheet',
  					type: 'text/css',
  					media: 'all',
  					href: this.urlAddVar( sPath , 'version', this._iJsDefaultVersion )
  				})
  			)
  		;
  	}

    * parses url and returns an associative array of url's variables (it can handle custom urls with '|' character)
	* @function parses url and returns an associative array of url's variables
	* @param {String} sUrl url to parse
	* @param {Boolena} bCustomVars boolean value to handle custom variable urls (after '|' character) or original variable urls
	* @returns {Object} object key->value of url's variables

	this.urlGetVars=function(sUrl,bCustomVars){
		sUrl = ( sUrl ? sUrl : '' );//Checking null values
		var _oVars = {};
		var _aHashes = new Array();
		if( !bCustomVars ){
			var _iStartIndex = sUrl.indexOf('?');
			var _iEndIndex = sUrl.indexOf('|');
			_aHashes=sUrl.substring(((_iStartIndex!=-1)?_iStartIndex+1:0),((_iEndIndex!=-1)?_iEndIndex:sUrl.length)).split('&');
		} else {
			var _iStartIndex=sUrl.indexOf('|');
			if( _iStartIndex!=-1 ){
				_aHashes = sUrl.substring( _iStartIndex+1, sUrl.length ).split('&');
			}
		}
		for( var i=0;i<_aHashes.length;i++ ){
			var _sHash = _aHashes[i];
			var _iIndex = _sHash.indexOf('=');
			if( _iIndex!=-1 ){
				var _sKey = _sHash.slice(0,_iIndex);
				var _sValue = _sHash.slice(_iIndex+1);
				_oVars[ _sKey ] = decodeURIComponent( _sValue );
			}
		}
		return _oVars;
	}

	this.urlAddVar=function(sUrl,sKey,value,bCustomVars){
		//Converting value
		switch(typeof value){
			case 'object':
				value=$.toJSON(value);
			break;
			default:
			break;
		}
		//Getting Vars
		var _oVars=this.urlGetVars(sUrl,bCustomVars);
		_oVars[sKey]=value;
		var _aTmp=new Array();
		for( var i in _oVars ){
			_aTmp.push( i + '=' + encodeURIComponent( _oVars[i] ) );
		}
		var _sSeparator=(bCustomVars?'|':'?');
		var _iIndex=sUrl.indexOf(_sSeparator);
		if(_iIndex!=-1)sUrl=sUrl.slice(0,_iIndex);
		sUrl=(_aTmp.length>0?sUrl+_sSeparator+_aTmp.join('&'):sUrl);
		return sUrl;
	}

	this.urlRemoveVar=function(sUrl,sKey,bCustomVars){
		var _oVars=this.urlGetVars(sUrl,bCustomVars);
		delete _oVars[sKey];
		var _aTmp=new Array();
		for(var i in _oVars)_aTmp.push(i+'='+_oVars[i]);
		var _sSeparator=(bCustomVars?'|':'?');
		var _iIndex=sUrl.indexOf(_sSeparator);
		if(_iIndex!=-1)sUrl=sUrl.slice(0,_iIndex);
		sUrl=(_aTmp.length>0?sUrl+_sSeparator+_aTmp.join('&'):sUrl);
		return sUrl;
	}
*/
}

// Exporting Singleton
const Tools = new ToolsClass();
export default Tools;
