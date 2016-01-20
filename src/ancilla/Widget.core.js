/**
 * A class to describe a generic Ancilla widget
 *
 * @class	Object
 * @public
 *
 * @param	{Object}		oOptions		Default datas to fill the newly created Ancilla widget
 *
 * @return	{Void}
 *
 * @example
 *		new WidgetCore( { id: 100 } );
 */
export class WidgetCore{
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
   *   Widget.__fillByOptions( oArray );
   */
  __fillByOptions( oArray ){
  	if( oArray ){
  		for( var _sKey in oArray ){
        var _sField = _sKey.toLowerCase();
        var value = oArray[ _sKey ];
        // Parsing JSON strings
        switch( _sField ){
          case 'options':
            if( value ){
              try{
                value = JSON.parse( value )
              } catch(e) {
                this.error('Unable to parse widget\'s options JSON string: "%o"', value )
              }
            }
          break;
          default:
            // Nothing to do
          break;
        }
        // Setting parameter's value
        this[ _sField ] = value;
  		}
  	}
  }

  /**
   * Method used to see if the widget has options configured
   *
   * @method    hasOptions
   * @public
   *
   * @return	{Boolean}  returns true if it has options
   *
   * @example
   *   Widget.hasOptions();
   */
  hasOptions(){
    return ( typeof this.options == 'undefined' ? false : true );
  }

  /**
   * Method used to return widget's ID
   *
   * @method    getID
   * @public
   *
   * @return    {Number}  returns widget's ID
   *
   * @example
   *   Widget.getID();
   */
  getID(){
    return this.id;
  }

  /**
   * Method used to return widget's option by value
   *
   * @method    getOption
   * @public
   *
   * @param     {String/Number}		value    The values used to look for the option
   *
   * @return    {Array}  returns options for a specific value
   *
   * @example
   *   Widget.getOption( 1 );
   */
  getOption( value ){
    return ( this.options ? this.options[ this.__getIndexByValue( value ) ] : null );
  }

  /**
   * Method used to return widget's option by value
   *
   * @method    __getIndexByValue
   * @private
   *
   * @param     {String/Number}		value			The values used to look for the option's index
   *
   * @return    {Array}  returns option's index for a specific value
   *
   * @example
   *   Widget.__getIndexByValue( 1 );
   */
   __getIndexByValue( value ){
    // Init variables
    var _iOptionIndex = -1;
      if( !isNaN( value ) ){
      var _fNearest = Number.MAX_VALUE;
      var _iMinIndex = 0;
      var _iMaxIndex = ( this.options.length - 1 );
      for( var _iIndex = _iMinIndex; _iIndex <= _iMaxIndex; _iIndex++ ){
      if( this.options[ _iIndex ] ){
        var _fCurrentOptionValue = this.options[ _iIndex ].value;
        if( value==_fCurrentOptionValue ){ // Exact value
          _iOptionIndex = _iIndex;
          break;
        } else if( _iMinIndex < _iIndex && _iIndex < _iMaxIndex ){ // Finding the nearest value, excluding first and last options ( which should be the min and max value... )
          var _fCurrent = Math.abs( value - _fCurrentOptionValue );
          if( _fNearest > _fCurrent ){
            _iOptionIndex = _iIndex;
            _fNearest = _fCurrent;
          } else {
            break;
          }
          }
        }
      }
    }
    if( _iOptionIndex == -1 ){
      _iOptionIndex = 0;
      this.error('Unable to find option\'s index for value: %o; assuming index 0.', value);
    }
    return _iOptionIndex;
  }

  /**
   * Method used to return widget's options
   *
   * @method    getOptions
   * @public
   *
   * @return	{Array}  returns an array of options
   *
   * @example
   *   Widget.getOptions();
   */
  getOptions(){
    return this.options;
  }

  /**
   * Method used to return the widget's model
   *
   * @method    getModel
   * @public
   *
   * @return	{String}  returns the widget's model
   *
   * @example
   *   Widget.getModel();
   */
  getModel(){
    return ( this.model ? this.model : 'widget.none' );
  }

  error( message, ...rest ){
    Ancilla.error( '[ Widget %o(%o) ]'+ message, this.id, this, ...rest );
  }

}
