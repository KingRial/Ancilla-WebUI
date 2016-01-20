/**
 * A class to describe a generic Ancilla relation
 *
 * @class	Object
 * @public
 *
 * @param	{Object}		oOptions		Default datas to fill the newly created Ancilla relation
 *
 * @return	{Void}
 *
 * @example
 *		new RelationCore( { id: 100 } );
 */
export class RelationCore{
  constructor( oOptions ){
    // Initializing Object
    this.__fillByOptions( oOptions );
	}

  /**
   * Method used to fill the object with datas
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
  			this[ _sField.toLowerCase() ] = oArray[ _sField ];
  		}
  	}
  }
}
