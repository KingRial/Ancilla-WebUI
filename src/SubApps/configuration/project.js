import {CoreViewModel} from '../core/classes/view-model';
import {DgramManager} from './classes/Dgram.Manager.js';
//import { default as Constant } from 'ancilla:Constants';

export class Project extends CoreViewModel{

  constructor(){
    super();
    this.oDgram = null;
    this.aObjects = [];
  }

  attached(){
      this.oDgram = new DgramManager({
          sContainerSelector: '.dgram-container',
          sDgramContainerSelector: '.dgram'
      });
      this.paint();
  }

  resetZoom(){
      this.oDgram.zoomReset();
  }

  paint(){
      this.oDgram.paint();
  }
}
