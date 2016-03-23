import {CoreViewModel} from '../core/classes/view-model';
import {DgramManager} from './classes/Dgram.Manager.js';
import { default as Ancilla } from 'ancilla:Ancilla';
import { default as Constant } from 'ancilla:Constants';

export class Project extends CoreViewModel{

  constructor(){
    super();
    this.aObjects = [];
    this._iSearchOffset = 0;
    this._iSearchMax = 10;
  }

  activate(){
    //Init dgram manager
    this.oDgram = new DgramManager({
        sContainerSelector: '.dgram-container',
        sDgramContainerSelector: '.dgram'
    });
    // Loading first item's in project
    let _View = this;
    return this.getObj({
      oWhere: {
        'type': { '!=': Constant._OBJECT_TYPE_TECHNOLOGY }
      },
      iSkip: this._iSearchOffset,
      iTake: this._iSearchMax
    })
      .then( function( aObjs ){
        aObjs.forEach( function( oObj ){
          _View.aObjects.push( oObj );
        });
        return this;
      })
    ;
/*
// Should load all the objects without a parent
  Ancilla.query({
			from: 'OBJECT',
			where: {
        //'not': { 'id': { 'in': 'RELATION.parentID' } }
        'not': { 'id': { '==': 0 } }
      },
      expand: [ 'RELATION' ],
      skip: this._iSearchOffset,
      take: this._iSearchMax
	})
*/
  }

  attached(){
    //this.oDgram.init();
    this.paint();
  }

  resetZoom(){
      this.oDgram.zoomReset();
  }

  paint(){
      this.oDgram.paint();
  }
}
