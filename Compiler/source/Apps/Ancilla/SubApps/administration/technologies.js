import {CoreViewModel} from '../core/core.view-model'
import { default as Constant } from 'ancilla:Constants';
import $ from 'jquery';
import 'jsplumb';
import './CSSs/technologies.css!';

export class Technologies extends CoreViewModel{

  __aLoadedIDs = new Array();
  __aLoadedTechnologies = new Array();
  __oJsPlumb = null;

  activate( oParams, oQueryString, oRouteConfig ){
    var _View = this;
    return this.loadObj( Constant._OBJECT_TYPE_TECHNOLOGY )
      .then( function( aLoadedIDs ){
        for( var _iIndex in aLoadedIDs ){
          var _iCurrentID = aLoadedIDs[ _iIndex ];
          var _oObj = Ancilla.getObj( _iCurrentID );
// TODO: show web technologies
          // Filtering by technology type ( we won't show web technologies )
          if( _oObj && _oObj.getTechnology()!= Constant._TECHNOLOGY_TYPE_WEB ){
            _View.__aLoadedTechnologies.push( _oObj );
            _View.__aLoadedIDs.push( _oObj.getID() );
          }
        }
        /*
        // Adding observer to every object options
        var _aPropertyToObserve = [];
        this.__aSubsciptions = multiObserver.observe(
          [[oilReserves, 'barrels'],
           [mood, 'crankiness'],
           [fudgeFactor, 'value']],
          () => this.test())
        ;
        */
        // Returning Promise
        return this;
      })
    ;
  }
  /*
  attached(){
    console.error( 'Technology Attached' );
  }
  */
  _init(){
    this.__initTechPosition();
    this.__initJsPlumb();
    this.__draw();
  }

  /*
  compositionComplete(){
    console.error( 'Technology compositionComplete' );
  }
  */

  __initJsPlumb(){
    if( !this.__oJsPlumb ){
      this.__oJsPlumb = jsPlumb.getInstance({
        Connector: 'StateMachine'
      });
    }
  }

  __initTechPosition(){
    var _jTechsContainer = $('.techs-container');
    var _iTechContainerWidth = _jTechsContainer.width();
    var _iTechContainerHeight = _jTechsContainer.height();
    var _jTechItem = $( '.tech-item' ).eq(0);
    var _iTechItemWidth = _jTechItem.width();
    var _iTechItemHeight = _jTechItem.height();
//console.error( 'Calculate Position on : %o %o for %o %o', _iTechContainerWidth, _iTechContainerHeight, _iTechItemWidth, _iTechItemHeight );
    var _iAngle = 0;
    var _iCenterX = ( _iTechContainerWidth / 2 );
    var _iCenterY = ( _iTechContainerHeight / 2 );
    var _iRadius = 100;
    // Getting all loaded techs except for "Core"
    var _iTotLoaded = ( this.__aLoadedIDs.length - 1 );
    for( var _iIndex in this.__aLoadedIDs ){
      var _iCurrentID = this.__aLoadedIDs[ _iIndex ];
      var _oObj = Ancilla.getObj( _iCurrentID );
      // Setting default position if not present
      if( !_oObj.options || ( !_oObj.options.xpos && !_oObj.options.ypos ) ){
        var _iXpos = 0;
        var _iYpos = 0;
        // Setting Core technology to the center; setting all the rest "around" the Core by default
        if( _oObj.id == 1){
          _iXpos = _iCenterX;
          _iYpos = _iCenterY;
        } else {
          _iXpos = ( _iCenterX + _iRadius * Math.cos( _iAngle * Math.PI / 180 - Math.PI / 2) );
          _iYpos = ( _iCenterY + _iRadius * Math.sin( _iAngle * Math.PI / 180 - Math.PI / 2) );
          _iAngle = _iAngle + ( 360 / ( _iTotLoaded == 0 ? 1 : _iTotLoaded ) );
        }
        // Changing center calculating item dimensions
        _iXpos -= ( _iTechItemWidth / 2 );
        _iYpos -= ( _iTechItemHeight / 2 );
        // Initializing infos over item
//console.error( 'X: %o, Y: %o Angle: %o', _iXpos, _iYpos, _iAngle );
        _oObj.options = Object.assign({
          xpos: _iXpos,
          ypos: _iYpos
        }, _oObj.options );
      }
    }
  }

  __getTechID4DOM( oTechnology ){
    return 'tech-' + oTechnology.getID();
  }

  __getEndpointUUID4DOM( oTechnology, oEndpoint ){
    return 'tech-' + oTechnology.getID() + '_endpoint-' + oEndpoint.getID();
  }

  __getJSPlumbInstance(){
    return this.__oJsPlumb;
  }

  __addEndpointTo( sCurrentDOM_ID, oOptions ){
    oOptions = Object.assign({
			sLabel: null,
      bSource: false,
      sUUUID: null
		}, oOptions );
    this.__getJSPlumbInstance()
      .addEndpoint( sCurrentDOM_ID, {
        endpoint: ( oOptions.bSource ? 'Rectangle' : 'Dot' ),
        isSource: oOptions.bSource,
        isTarget: !oOptions.bSource,
        //maxConnections: -1,
        connector: [
          'Flowchart', {
            stub: [40, 60],
            gap: 10,
            cornerRadius: 5,
            alwaysRespectStubs: true
          }
        ],
        overlays: [
          [ 'Label', {
              location: [ 0.5, -0.5 ],
              label:  oOptions.sLabel
              //cssClass: 'label'
          } ]
        ]
      },{
        anchor: 'Continuous',
        uuid: oOptions.sUUUID
      })
    ;
  }

// TODO: updating default position should fire the "draw" method
  __draw( bRedraw ){
    var _JSPlub = this.__getJSPlumbInstance();
    if( bRedraw ){
      if( _JSPlub ){
        _JSPlub.repaintEverything();
      }
    } else {
      var _aDOM_IDs = [];
      var _oListenerEndpoints = {};
      var _oConnectEndpoints = {};
      // Cycling over loaded technologies
      for( var _iIndexID in this.__aLoadedIDs ){
        var _iCurrentID = this.__aLoadedIDs[ _iIndexID ];
        var _oTechnology = Ancilla.getObj( _iCurrentID );
        var _sCurrentDOM_ID = this.__getTechID4DOM( _oTechnology );
        // Filling DOM IDs
        _aDOM_IDs.push( _sCurrentDOM_ID );
        // Drawing Endpoints
        var _aEndpoints = _oTechnology.getEndpoints();
        for( var _iIndexEndpoint in _aEndpoints ){
          var _oEndpoint = _aEndpoints[ _iIndexEndpoint ];
          var _sEndpointUUID = this.__getEndpointUUID4DOM( _oTechnology, _oEndpoint );
          var _bEndpointIsListener = _oEndpoint.isListener();
          if( _bEndpointIsListener ){
            _oListenerEndpoints[ _sEndpointUUID ] = _oEndpoint;
          } else {
            _oConnectEndpoints[ _sEndpointUUID ] = _oEndpoint;
          }
          this.__addEndpointTo( _sCurrentDOM_ID, {
            sLabel: _oEndpoint.getID(),
            bSource: _bEndpointIsListener,
            sUUUID: _sEndpointUUID
          })
        }
      }
      // Setting draggbale status
      _JSPlub.draggable( _aDOM_IDs );
      // Cycling over loaded endpoints
      for( var _sUUIDListener in _oListenerEndpoints ){
        var _oListenerEndpoint = _oListenerEndpoints[ _sUUIDListener ];
        for( var _sUUIDConnect in _oConnectEndpoints ){
          var _oConnectEndpoint = _oConnectEndpoints[ _sUUIDConnect ];
          if( _oListenerEndpoint.isConnectedTo( _oConnectEndpoint ) ){
            _JSPlub.connect({
              source: _sUUIDConnect,
              target: _sUUIDListener
            });
          } else {
            console.error( '%o NON è connesso a %o', _oListenerEndpoint, _oConnectEndpoint );
          }
        }
      }
    }
  }

}
