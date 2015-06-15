import {ObjectCore} from 'ancilla:Object.Core';

/**
 * A class to describe a generic Ancilla group object
 *
 * @class	Object
 * @public
 *
 * @param	{Object}		oOptions		Default datas to fill the newly created Ancilla object
 *
 * @return	{Void}
 *
 * @example
 *		new ObjectGroup( { id: 100 } );
 */
export class ObjectGroup extends ObjectCore {
  getURL(){
    return this.value;
  }
}
