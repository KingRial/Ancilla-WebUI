import {customElement,bindable} from 'aurelia-framework';
import { default as Ancilla } from 'ancilla:Ancilla';
import {CoreViewModel} from './SubApps/core/core.view-model';

@customElement('status')
export class Status extends CoreViewModel{
  @bindable messages;

  // TODO: improve STATUS page ( right now is only showing errors forever )

  handleMessage( sType, iIndex ){
    Ancilla.handleMessage( sType, iIndex );
  }
}
