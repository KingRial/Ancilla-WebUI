import {inject,ObserverLocator} from 'aurelia-framework'
import {CoreViewModel} from '../core/core.view-model'

@inject( ObserverLocator )
export class CoreWidget extends CoreViewModel{

  __oObserverLocator = null;
  __fDispatchSubscription = null;

  oObj = null;
  oWidget = null;
  hasOptions = false;
  oOptions = null;
  oCurrentOptions = null;

  constructor( oObserverLocator ) {
    super();
    this.__oObserverLocator = oObserverLocator;
  }

	//Binded module from compose is passed as first argument of the activate
  activate( oParams, oQueryString, oRouteConfig ){
    //this.sView = oParams[1] || 'grid'; // TODO: it can be taken from the current URL ( Example: runtime/plan )
    this.oObj = oParams;
    this.oWidget = this.oObj.getWidget();
    this.hasOptions = this.oWidget.hasOptions();
    if( this.hasOptions ){
      this.oOptions = this.oWidget.getOptions();
      this.__updateCurrentOption( this.oObj.getValue() );
      this.__fDispatchSubscription = this.__oObserverLocator
         .getObserver( this.oObj, 'value' )
         .subscribe( ( newValue, oldValue ) => this.__updateCurrentOption( newValue, oldValue ) )
      ;
    }
  }

  deactivate(){
    this.__fDispatchSubscription();
  }

  __updateCurrentOption( newValue, oldValue ){
    this.oCurrentOptions = this.oWidget.getOption( newValue );
  }

}
