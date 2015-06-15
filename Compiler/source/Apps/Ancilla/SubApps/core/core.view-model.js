import {inject,ObserverLocator} from 'aurelia-framework';
import Materialize from 'materialize';

/**
 * A class to describe a generic Aurelia view used by Ancilla
 *
 * @class	CoreViewModel
 * @public
 *
 * @return	{Void}
 *
 */

@inject( ObserverLocator )
export class CoreViewModel {
	__oSubscribedEvent = [];
	__oObserverLocator = null;

	constructor( oObserverLocator ){
		this.__oObserverLocator = oObserverLocator;
	}

	/**
	* Method used by the view to deactivate itself from a router.
	* During this event all subscribed events are unsubscribed by default.
	*
	* @method    deactivate
	* @public
	*
	* @return	{Void}
	*
	* @example
	*   this.deactivate();
	*/
	deactivate(){
		// Unsubscribing all subscribed events
		for( var _iIndex in this.__oSubscribedEvent ){
			this.__oSubscribedEvent[ _iIndex ]();
		}
	}

	/**
	* Method used by the view to mirror an object's property when it's changing using Observe method
	*
	* @method    mirrorObjectProperty
	* @public
	*
	* @param     {Object}		oObject			The object
	* @param     {String}		sObjectProperty			The object's property
	* @param     {String}		sViewProperty			The view's property which will mirror the object's propery
	*
	* @return	{Function}	The function to call if you wish to unsubscribe the subscribed observe event. By default the unsubscribe operation will be handled by view's "deactivate" method.
	*
	* @example
	*   this.mirrorObjectProperty( Ancilla.getStatus(), 'bIsConnected', '__bAncillaIsConnected' );
	*/
	mirrorObjectProperty( oObject, sObjectProperty, sViewProperty ){
		var _fUnSubscribeObserveEvent = this.__oObserverLocator
			.getObserver( oObject, sObjectProperty )
			.subscribe( ( newValue, oldValue ) => this.__mirrorObjectPropertyCallback( sViewProperty, newValue, oldValue ) )
		;
		this.__oSubscribedEvent.push( _fUnSubscribeObserveEvent );
		return _fUnSubscribeObserveEvent;
	}

	/**
	* Method used by the view's "mirrorObjectProperty" method to update view's property
	*
	* @method    __mirrorObjectPropertyCallback
	* @private
	*
	* @param     {Object}		sViewProperty			The view's property to update
	* @param     {String/Number/Boolean}		newValue			The new value
	* @param     {String/Number/Boolean}		oldValue			The old value
	*
	* @return	{Void}
	*
	* @example
	*   this.__mirrorObjectPropertyCallback( '__bAncillaIsConnected', true , false );
	*/
	__mirrorObjectPropertyCallback( sViewProperty, newValue, oldValue ){
		this[ sViewProperty ] = newValue;
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
   *   {$getConstant('_LANG_LOADING')}
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
	loadObj( IDsOrTypes ){
		var _View = this;
		return Ancilla.loadObj( IDsOrTypes );
	}

	/**
	* Method used by the view to fire an error message
	*
	* @method    error
	* @public
	*
	* @param     {sMessage}		sMessage		A message to display ( same use as javascript console method )
	* @param     {String/Number/Object}		...rest		All the variables used inside the message
	*
	* @return	{Promise}		The promise is successfull when the object has been loaded
	*
	*/
	error( sMessage, ...rest ){
		var _iIndex = 0;
		// TODO: using window['Materialize'] because materialize is not compatible with ES6; change this in the future
		window['Materialize'].toast( sMessage.replace(/%(.)/, function(_, c){
	    switch(c){
	      case '%':
	        return '%';
				break;
				default:
					var _currentRest = rest[i++];
	        return String( _currentRest );
				break;
	    }
	  }), 4000, 'rounded');
    Ancilla.error( '[ View %o ]'+ sMessage, this, ...rest );
  }
}
