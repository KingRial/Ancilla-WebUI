import {CoreViewModel} from '../core/core.view-model'

export class Message extends CoreViewModel{
  activate(){
    console.error('Arguments: %o', arguments);
  }
}
