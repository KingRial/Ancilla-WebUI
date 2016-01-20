import {Logger} from 'ancilla:Logger';

export class CoreLibrary{
	constructor( oOptions ){
		oOptions = Object.assign({
			sLoggerID: 'Logger'
		}, oOptions );
		this._oLogger = new Logger( oOptions.sLoggerID );
	}

	setLogLevel( iLogLevel ){
		this._oLogger.setLogLevel( iLogLevel );
	}

	getLogLevel(){
		this._oLogger.getLogLevel();
	}

  info( message, ...rest ){
    this._oLogger.info( message, ...rest );
  }
  debug( message, ...rest ){
    this._oLogger.debug( message, ...rest );
  }
  warn( message, ...rest ){
    this._oLogger.warn( message, ...rest );
  }
  error( message, ...rest ){
    this._oLogger.error( message, ...rest );
  }
}
