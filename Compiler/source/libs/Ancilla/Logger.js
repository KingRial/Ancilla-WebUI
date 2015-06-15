import { default as Constant } from 'ancilla:Constants';

/**
 * A class to describe an Ancilla Logger
 *
 * @class	Event
 * @public
 *
 * @param	{String}		sID		Logger ID
 *
 * @return	{Void}
 *
 * @example
 *		new Logger( 'Ancilla' );
 */
export class Logger {
  constructor( sID ){
    this.__sID = sID;
    this.__iLogLevel = Constant._LOG_ERROR;
  }

  setLogLevel( iLevel ){
    this._iLogLevel = iLevel;
  }

  getLogLevel(){
    return this._iLogLevel;
  }

  getID(){
    return this.__sID;
  }

  debug( message, ...rest){
    if( this.getLogLevel < Constant._LOG_DEBUG ){
      return;
    }
    console.debug(`DEBUG [${this.getID()}] ${message}`, ...rest);
  }

  info( message, ...rest){
    if( this.getLogLevel < Constant._LOG_INFO ){
      return;
    }
    console.info(`INFO [${this.getID()}] ${message}`, ...rest);
  }

  warn( message, ...rest){
    if( this.getLogLevel < Constant._LOG_WARN ){
      return;
    }
    console.warn(`WARN [${this.getID()}] ${message}`, ...rest);
  }

  error( message, ...rest){
    if( this.getLogLevel < Constant._LOG_ERROR ){
      return;
    }
    console.error(`ERROR [${this.getID()}] ${message}`, ...rest);
  }
}
