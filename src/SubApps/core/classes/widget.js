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
