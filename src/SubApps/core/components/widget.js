import {bindable, inject, customElement} from 'aurelia-framework';

@customElement('widget')
@inject(Element)

export class CoreComponentWidget {
  @bindable object;

  constructor( element ){
      this.view = element.getAttribute('view');
      this.viewModel= element.getAttribute('view-model');
  }
}
