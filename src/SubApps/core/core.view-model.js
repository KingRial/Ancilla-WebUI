import { default as Ancilla } from 'ancilla:Ancilla';

/**
 * A class to describe a generic Aurelia view used by Ancilla
 *
 * @class	CoreViewModel
 * @public
 *
 * @return	{Void}
 *
 */

export class CoreViewModel {

	getAncilla(){
		return Ancilla;
	}

	/**
   * Method used by the view to get a Language constant
   *
   * @method    getConstant
   * @public
   *
   * @param     {String}		sString			The language constant string
   *
   * @return	{String}	The translated language constant using the current selected language
   *
   * @example
   *   ${getConstant('_LANG_LOADING')}
   */
	getConstant( sString ){
		return Ancilla.getConstant( sString );
	}

	/**
	* Method used by the view to load an Ancilla object
	*
	* @method    loadObj
	* @public
	*
	* @param     {Number/String}		IDsOrTypes		The object's ID or type
	*
	* @return	{Promise}		The promise is successfull when the object has been loaded
	*
	*/
	/*
	loadObj( IDsOrTypes ){
		//var _View = this;
		return Ancilla.loadObj( IDsOrTypes );
	}
	*/

	/*
	onEnterPressed( oEvent ){
		return ( oEvent && oEvent.type === 'keypress' && oEvent.charCode===13 ? true : false );
	}
	*/
	/*
	onEnterPressed( oEvent ){
		var _iKeyCode = null;
		if( window.event && window.event.keyCode ){ //Simulated events will have keyCode set to 0
		    _iKeyCode = window.event.keyCode;
		} else if( oEvent ){
		    _iKeyCode = oEvent.which;
		} else {
		    return false;
		}
		// Checking HTML target
		var _jTarget = $( oEvent.currentTarget );
		var _bTargetIsValid = ( _jTarget.size()>0 );
		// Ignoring SHIFT+Enter when using a textarea
		var _bFoundEnter = ( _iKeyCode == 13 && ( _bTargetIsValid && ( ( !oEvent.shiftKey && _jTarget.is('textarea') ) || !_jTarget.is('textarea') ) ) );
		// Blur Target or add char
		if( _bTargetIsValid && _bFoundEnter ){
		    _jTarget.blur();
		}
  }
	*/

	/**
	* Method used by the view to fire an error message
	*
	* @method    error
	* @public
	*
	* @param     {Object}		oError		The Ancilla error object
	* @param     {String}		[sMessage]		A different message to display into the UI
	*
	* @return	{Void}
	*
	*/
	error( oError ){
		let _iCode = ( oError.getCode ? oError.getCode() : 999 );
		let _sErrorMessage = oError.toString();
    Ancilla.error( '[ View %o ] %s', this, _sErrorMessage );
		Ancilla.messageError( _iCode, this.getConstant( '_LANG_ERROR_' + _iCode ) );
  }
}
