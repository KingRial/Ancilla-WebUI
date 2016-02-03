import { default as Constant } from 'ancilla:Constants';
import { default as Tools } from 'ancilla:Tools';

/**
 * A class to describe an Ancilla Event
 *
 * @class	Event
 * @public
 *
 * @param	{Object}		oOptions		Default datas to fill the newly created Ancilla Event
 *
 * @return	{Void}
 *
 * @example
 *		new Event( { sType: 'test-event' } );
 */
export class Event{
  constructor( oOptions ){
    // Default Options
    oOptions = Object.assign({
      iID: new Date().getTime(),
      sType: null,
      sFromID: null,
      sToID: 'Core',
      //iResult : 0
      //bIsAnswer: false,
      bNeedsAnswer : true,
      iTimeout: 15000, // Milliseconds
    }, oOptions );
    // Initializing Event
    this.__fillByOptions( oOptions );
	}

  /**
   * Method used to fille the event with datas
   *
   * @method    __fillByOptions
   * @private
   *
   * @param     {Object}		oArray			The datas used to fill the event
   *
   * @return	{Void}
   *
   * @example
   *   Event.__fillByOptions( oArray );
   */
  __fillByOptions( oArray ){
  	if( oArray ){
  		for( var _sField in oArray ){
        if( oArray.hasOwnProperty( _sField ) ){
  			     this[ _sField ] = oArray[ _sField ];
        }
  		}
  	}
  }

  /**
   * Method used to convert Event to String
   *
   * @method    toString
   * @public
   *
   * @return    {String}	the converted string which describes current Event
   *
   * @example
   *   Event.toString();
   */
  toString(){
  	return JSON.stringify( this );
  }

  /**
   * Method used to return Event ID
   *
   * @method    getID
   * @public
   *
   * @return    {Number}	it returns the Event ID
   *
   * @example
   *   Event.getID();
   */
  getID(){
  	return this.iID;
  }

  /**
   * Method used to return Event type
   *
   * @method    getType
   * @public
   *
   * @return    {String}	it returns the Event type
   *
   * @example
   *   Event.getType();
   */
  getType(){
  	return this.sType;
  }

  /**
   * Method used to return Event recipient
   *
   * @method    getTo
   * @public
   *
   * @return    {String}	it returns the Event recipient
   *
   * @example
   *   Event.getTo();
   */
  getTo(){
  	return this.sToID;
  }

  /**
   * Method used to return Event sender
   *
   * @method    getFrom
   * @public
   *
   * @return    {String}	it returns the Event sender
   *
   * @example
   *   Event.getFrom();
   */
  getFrom(){
  	return this.sFromID;
  }

  /**
   * Method used to return Event timeout ( milliseconds )
   *
   * @method    getTimeout
   * @public
   *
   * @return    {Number}	it returns the Event timeout ( milliseconds )
   *
   * @example
   *   Event.getTimeout();
   */
  getTimeout( ){
  	return this.iTimeout;
  }

  /**
   * Method used to return Event answer result
   *
   * @method    getResult
   * @public
   *
   * @return    {Number}	it returns the Event answer result
   *
   * @example
   *   Event.getResult();
   */
  getResult(){
  	return this.iResult;
  }

  /**
   * Method used to understand if the Event is a Request
   *
   * @method    isRequest
   * @public
   *
   * @return    {Boolean}	it returns true if it's a request
   *
   * @example
   *   Event.isRequest();
   */
  isRequest(){
  	return ( this.bIsAnswer ? false : true );
  }

  /**
   * Method used to understand if the Event is an Answer
   *
   * @method    isAnswer
   * @public
   *
   * @return    {Boolean}	it returns true if it's an Answer
   *
   * @example
   *   Event.isAnswer();
   */
  isAnswer(){
  	return ( ! this.isRequest() );
  }

  /**
   * Method used to understand if the Event request needs an answer
   *
   * @method    needsAnswer
   * @public
   *
   * @return    {Boolean}	it returns true if it needs an answer
   *
   * @example
   *   Event.needsAnswer();
   */
  needsAnswer(){
  	return this.bNeedsAnswer;
  }

  /**
   * Method used to transform an Event request into an Event answer
   *
   * @method    needsAnswer
   * @public
   *
   * @param     {Number}		[iResult]			The result of the requested operation which needed the answer
   * @param     {Object}		[oAdditionalData]			Additional data to add to the Event answer
   *
   * @return	{Void}
   *
   * @example
   *   Event.setToAnswer( Constant._NO_ERROR );
   *   Event.setToAnswer( oAdditionalData );
   *   Event.setToAnswer( Constant._NO_ERROR, oAdditionalData );
   */
  setToAnswer(){
    var oAdditionalData = null;
    var iResult = null;
    switch( arguments.lenght ){
      case 1:
  			var _bIsNumeric = Tools.isNumeric( arguments[ 0 ]  );
  			iResult = ( _bIsNumeric ? arguments[ 0 ] : null );
        oAdditionalData = ( !_bIsNumeric ? arguments[ 0 ] : null );
        break;
      default:
  			iResult = arguments[ 0 ];
  			oAdditionalData = arguments[ 1 ];
        break;
    }
  	// It should be an answer so it doesn't require a response anymore... but this can be overwritten using additional datas
  	// Removing useless fields to reduce string length
  	delete this.bRequireResponse;
  	delete this.iTimeout;
  	oAdditionalData = Tools.extend({
  		sFromID: this.sToID, // Exchanging source with destination
  		sToID: this.sFromID, // Exchanging source with destination
  		bIsAnswer: true, // Setting answer type
      iResult: Constant._NO_ERROR, // Setting default response
  	}, ( oAdditionalData || {} ) );
  	// Filling with additional data
  	this.__fillByOptions( oAdditionalData );
  }
}
