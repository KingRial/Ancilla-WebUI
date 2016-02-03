import { default as Constant } from 'ancilla:Constants';
import { default as Ancilla } from 'ancilla:Ancilla';

/**
 * A class to describe a generic Ancilla object
 *
 * @class	Object
 * @public
 *
 * @param	{Object}		oOptions		Default datas to fill the newly created Ancilla object
 *
 * @return	{Void}
 *
 * @example
 *		new ObjectCore( { id: 100 } );
 */
export class ObjectCore{
  constructor( oOptions ){
    // Default Options
    //oOptions = Object.assign({
    //}, oOptions );
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
        if( oArray.hasOwnProperty( _sField ) ){
          var _sCurrentField = _sField.toLowerCase();
          switch( _sCurrentField ){
            case 'name':
            this[ _sCurrentField ] = Ancilla.getConstant( oArray[ _sField ] );
            break;
            case 'options':
              try{
                this[ _sCurrentField ] = JSON.parse( oArray[ _sField ] );
              } catch( e ){
                this.error( '[ Error: %o ] Unable to parse correctly "option" field during object initialization', e );
              }
              break;
            default:
              this[ _sCurrentField ] = oArray[ _sField ];
              break;
          }
        }
  		}
  	}
  }

  getID(){
    return this.id;
  }

  getType(){
    return this.type;
  }

  getTechnology(){
    return this.technology;
  }

  getValue(){
    return this.value;
  }

  setValue( value ){
    this.update({ value: value});
  }

//TODO: add filter option
  getParents(){
    return Ancilla.getObjsByChild( this.id );
  }

//TODO: add filter option
  getChildren(){
    return Ancilla.getObjsByParent( this.id );
  }

  /**
   * Method used to return the object's widget
   *
   * @method    getWidget
   * @public
   *
   * @return	{Object}  returns the object's widget
   *
   * @example
   *   Object.getWidget();
   */
  getWidget(){
    return Ancilla.getWidget( this.widget_id );
  }

  /**
   * Method used to update the object's fields
   *
   * @method    update
   * @public
   *
   * @param	{Object}		oFieldsWithNewValues		an object instance filled with field -> value list to update
   *
   * @return	{Void}
   *
   * @example
   *   Object.update({ value: 0, is_visible: true });
   */
  update( oFieldsWithNewValues ){
    // Remembering previous value for each field
    var _oFieldsWithOldValues = {};
    for( var _sField in oFieldsWithNewValues ){
      if( oFieldsWithNewValues.hasOwnProperty( _sField ) ){
        var newValue = oFieldsWithNewValues[ _sField ];
        _oFieldsWithOldValues[ _sField ] = this[ _sField ];
        // Updating field over object
        this[ _sField ] = newValue;
      }
    }
    // Adding Object's ID ( overwriting previous one if present; the ID must not change )
    oFieldsWithNewValues.id = this.getID();
    // Sending update trigger over server
    var _Object = this;
    Ancilla.trigger( { sType: Constant._EVENT_TYPE_UPDATE, aObjs: [ oFieldsWithNewValues ] } )
      .catch( function( oError ){
        _Object.error('[ Error: %o] Unable to set values: %o; restoring previous values: %o...', oError, oFieldsWithNewValues, _oFieldsWithOldValues );
        // Restoring previous values
        for( var _sField in _oFieldsWithOldValues ){
          if( _oFieldsWithOldValues.hasOwnProperty( _sField ) ){
            var oldValue = _oFieldsWithOldValues[ _sField ];
            this[ _sField ] = oldValue;
          }
        }
      });
  }

  warn( message, ...rest ){
    Ancilla.warn( '[ Object %o(%o) ]'+ message, this.id, this, ...rest );
  }

  error( message, ...rest ){
    Ancilla.error( '[ Object %o(%o) ]'+ message, this.id, this, ...rest );
  }
}
