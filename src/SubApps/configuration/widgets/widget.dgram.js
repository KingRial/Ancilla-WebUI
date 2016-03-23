import {inject} from 'aurelia-framework';
import {CoreWidget} from '../../core/classes/widget';


@inject(Element)

export class WidgetDgramElement extends CoreWidget {

    constructor( element ){
      super();
      this.__oElement = element;
    }

    activate( oParameters ){
      for( let _sField in oParameters ){
          if( oParameters.hasOwnProperty( _sField ) ){
              this[ _sField ] = oParameters[ _sField ];
          }
      }
      // Since it seems this widget will be activated twice and the second time it has everything correctly initialized ( still don't understand the reasons :) )
      this.paintElement();
    }

    attached(){
      // When the widget is activated twice the attached event is "too soon"; otherwise it's good
      this.paintElement();
    }

    paintElement(){
      // The injected Element is always the "compose"; the "composed" element is the first child of the "compose" element
      let _oElement = this.__oElement.children[ 0 ];
      if( _oElement && this.oDgram ){
          this.oDgram.paintObject( this.oObj, _oElement );
      }/* else {
console.error( 'Wdiget DGRAM unable to paint!' );
      }*/
    }
}
