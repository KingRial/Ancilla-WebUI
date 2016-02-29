/**
 * A class to describe a generic Widget
 *
 * @class	CoreWidget
 * @public
 *
 * @return	{Void}
 *
 * @example
 *  <compose
 *    model.bind="oObj"
 *    view-model="./widgets/${oObj.getWidget().getModel()}">
 *  </compose>
 * or:
 *  <compose
 *    model.bind="[oObj,'Current-View']"
 *    view-model="./widgets/${oObj.getWidget().getModel()}">
 *  </compose>
 */

import {CoreViewModel} from '../core/core.view-model'

export class CoreWidget extends CoreViewModel{

  constructor(){
    super();
    this.oObj = null;
    this.oWidget = null;
    this.hasOptions = false;
    this.oOptions = null;
    this.oCurrentOptions = null;
  }

  activate( oOptions ){
    oOptions = ( Array.isArray( oOptions ) ? oOptions : [ oOptions ] );
    this.oObj = oOptions[ 0 ];
    this.sView = oOptions[ 1 ];
    this.oWidget = this.oObj.getWidget();
    this.hasOptions = this.oWidget.hasOptions();
    if( this.hasOptions ){
      this.oOptions = this.oWidget.getOptions();
      this.__updateCurrentOption( this.oObj.getValue() );
    }
  }

  __updateCurrentOption( newValue ){
    this.oCurrentOptions = this.oWidget.getOption( newValue );
  }

}
