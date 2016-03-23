import {bindable, inject, customElement} from 'aurelia-framework';

@customElement('widget')
@inject(Element)

export class CoreComponentWidget {
  @bindable object;

  constructor( element ){
      this.view = element.getAttribute('view');
      this.viewModel = element.getAttribute('view-model');
  }

  getModel(){
    let _oWidget = ( this.object ? this.object.getWidget() : null );
    let _sWidgetModel = ( _oWidget ? _oWidget.getModel() : 'widget.none' );
    return '../widgets/' + ( this.viewModel ? this.viewModel : _sWidgetModel );
  }

}
