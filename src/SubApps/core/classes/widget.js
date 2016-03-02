/**
 * A custom element to compile an object's widget
 *
 * @class	CoreWidget
 * @private
 *
 * @param	{Object}		object		    The object which should be shown using the widget
 * @param	{String}		[view]		    The view for which the widget should be composed
 * @param	{String}		[view-model]	The view-model to use instead of the view model configured in the object
 *
 * @return	{Object} An ancilla custom element called "widget"
 *
 * @example
 * <widget view="homepage" object.bind="oObjectToCompose"></widget>
 * <widget view="homepage" view-model="../widget.list" object.bind="oObjectToCompose"></widget>
 */

import {CoreViewModel} from './view-model'

export class CoreWidget extends CoreViewModel{

  constructor(){
    super();
    this.oObj = null;
    this.oWidget = null;
    this.hasOptions = false;
    this.oOptions = null;
    this.oCurrentOptions = null;
  }

  activate( oParameters ){
    for( let _sField in oParameters ){
      if( oParameters.hasOwnProperty( _sField ) ){
        this[ _sField ] = oParameters[ _sField ];
      }
    }
    if( this.oObj ){
      this.oWidget = this.oObj.getWidget();
      this.hasOptions = this.oWidget.hasOptions();
      if( this.hasOptions ){
        this.oOptions = this.oWidget.getOptions();
        this.__updateCurrentOption( this.oObj.getValue() );
      }
    }
  }

  __updateCurrentOption( newValue ){
    this.oCurrentOptions = this.oWidget.getOption( newValue );
  }

  getViewStrategy(){
    let _sModel = '../widgets/widget.none';
    if( this.sViewModel ){
      _sModel = this.sViewModel;
    } else if( this.oWidget ){
      _sModel = '../widgets/' + this.oWidget.getModel();
    }
    return _sModel + '.html';
  }

}
