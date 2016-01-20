import {ObjectCore} from 'ancilla:Object.Core';
//import { default as Forge} from 'forge';

/**
 * A class to describe a generic Ancilla user object
 *
 * @class	Object
 * @public
 *
 * @param	{Object}		oOptions		Default datas to fill the newly created Ancilla object
 *
 * @return	{Void}
 *
 * @example
 *		new ObjectUser( { id: 100 } );
 */
export class ObjectUser extends ObjectCore {
  /*
  hashPassword( sPassword ){
    return Forge.md.sha1.create().update( sPassword ).digest().toHex();
  }
  */
}
