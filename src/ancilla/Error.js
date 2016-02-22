/**
 * A class to describe a generic Ancilla Error
 *
 * @class	Event
 * @public
 *
 * @param	{Number}		[iNumber]		A unique integer number to identify the error
 * @param	{String}		[sDescription]		An error's description
 *
 * @return	{Void}
 *
 * @example
 *		new AncillaError( 100 );
 *		new AncillaError( 'An error!' );
 *		new AncillaError( 100, 'An Error!' );
 */
// TODO: should understand how to be able to show the "string error" on console javascript, without using the "toString" method explicitly
export class AncillaError extends Error{

  constructor(){
    let _sDescription = null;
    let _iNumber = null;
    for( let _iIndex=0; _iIndex<arguments.length; _iIndex++){
      let _arg = arguments[ _iIndex ];
      switch( typeof _arg ){
        case 'string':
          _sDescription = _arg;
        break;
        case 'number':
          _iNumber = _arg;
        break;
        default:
          // Nothing to do
        break;
      }
    }
    super();
    this._iNumber = _iNumber;
    this._sDescription = _sDescription;
  }

  __toString(){
    return ( this._iNumber ? '( Error: ' + this._iNumber + ' ) ' : '' ) + ( this._sDescription ? this._sDescription : '' );
  }

  toString(){
    return this.__toString();
  }

  valueOf(){
    return this.__toString();
  }

  getCode(){
    return this._iNumber;
  }

}
