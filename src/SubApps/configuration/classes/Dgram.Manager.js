import { default as Ancilla } from 'ancilla:Ancilla';
import $ from 'jquery';
import 'jsplumb';
import '../styles/dgram.css!';

/*
// TODO:
Griglia per spostamento
Messaggio griglia vuota
Multiple drag doesn't work
"Canc" key to delete things
*/

export class DgramManager {

    constructor( oOptions ){
        this.__oOptions = Object.assign({
            sContainerSelector: '.dgram-container',
            sDgramContainerSelector: '.dgram-container-dgram',
            sDgramElementSelector: '.dgram-element',
            sDgramElementSelectedClass: 'dgram-element-selected',
            bDraggable: true
        }, oOptions );
        //
        this.__jContainer = $( this.__oOptions.sContainerSelector );
        this.__jDgramContainer = $( this.__oOptions.sDgramContainerSelector );
        this.__aElements = [];
        this.__oRubberBand ={
            jRubberBand: null,
            oStartPoint: {},
            bDrawing: false
        };
        this.__init();
    }

    __init(){
      // Init JSPlumb
      this.__initJSPlumb();
      // Init Zoom
      this.__initZoom();
      // Init rubberband
      this.__initRubberBand();
    }

    __getContainer(){
        return this.__jContainer;
    }

    __getDgramContainer(){
        return this.__jDgramContainer;
    }

    __getJSPlumbInstance(){
        return this.__oJsPlumb;
    }

    __getUUID( oObj, bSource, iIndex ){
        let _sUUID = 'object-' + oObj.id + '-endpoint-' + ( bSource ? 'source' : 'target' ) + ( iIndex ? '-' + iIndex : '' );
        return _sUUID;
    }

    paintObject( oObj, oElement ){
        // Setting hover class on DOM element
        $( oElement ).hover( function(){ $(this).toggleClass('dgram-element-hover'); } );
        // Painting
        this.__paintObject( oObj, oElement );
        // Adding to element list
        //this.__aElements.push( oElement );
        // Updating draggable status
        this.__updateDraggable( oElement );
    }

    getDgramElements(){
        return this.__getDgramContainer().find( this.__oOptions.sDgramElementSelector );
    }

    __paintObject( oObj, oElement ){
        let _Dgram = this;
        // Creating object endpoints
        _Dgram.__addEndpoint({
            //sLabel: 'Endpoint target',
            element: oElement,
            bSource: true,
            sUUID: _Dgram.__getUUID( oObj, true )
        });
        _Dgram.__addEndpoint({
            //sLabel: 'Endpoint source',
            element: oElement,
            bSource: false,
            sUUID: _Dgram.__getUUID( oObj, false )
        });
        // Creating object's endpoint's connections
        oObj.getParents().forEach( function( oParent ){
            _Dgram.__addConnector({
                //sLabel: 'Parent relation',
                sUUIDSource: _Dgram.__getUUID( oParent, true ),
                sUUIDTarget: _Dgram.__getUUID( oObj, false )
            });
        });
        oObj.getChildren().forEach( function( oChild ){
            _Dgram.__addConnector({
                //sLabel: 'Child relation',
                sUUIDSource: _Dgram.__getUUID( oObj, true ),
                sUUIDTarget: _Dgram.__getUUID( oChild, false )
            });
        });
    }

    __addEndpoint( oOptions ){
//console.error( 'Add Endpoint: ', oOptions.sUUID );
        oOptions = Object.assign({
            sLabel: null,
            element: null,
            bSource: false,
            iMaxConnections: -1,
            sUUID: null
        }, oOptions );
        this.__getJSPlumbInstance()
            .addEndpoint( oOptions.element, {
                endpoint: ( oOptions.bSource ? 'Rectangle' : 'Dot' ),
                anchor: ( oOptions.bSource ? 'RightMiddle' : 'LeftMiddle' ),
                isSource: oOptions.bSource,
                isTarget: !oOptions.bSource,
                maxConnections: oOptions.iMaxConnections,
                overlays: [
                    [ 'Label', {
                        location: [ 0.5, -0.5 ],
                        label:  oOptions.sLabel
                    } ]
                ]
            }, {
               anchor: 'Continuous',
               uuid: oOptions.sUUID
            })
        ;
    }

    __addConnector( oOptions ){
//console.error( 'Connect: %o --> %o ', oOptions.sUUIDSource, oOptions.sUUIDTarget );
        oOptions = Object.assign({
            sLabel: null,
            sUUIDSource: null,
            sUUIDTarget: null
        }, oOptions );
        this.__getJSPlumbInstance()
            .connect({
                uuids: [ oOptions.sUUIDSource, oOptions.sUUIDTarget ],
                detachable: true,
                reattach: true,
                overlays:[
                    [ 'Label', {
                        label: oOptions.sLabel
                    }]
                ]
            })
        ;
    }

    __updateDraggable( oElement ){
console.error('Draggable: ', oElement );
        if( this.__oOptions.bDraggable && oElement ){
console.error('Drag!');
            this.__getJSPlumbInstance()
                .draggable( oElement )
            ;
        }
    }

    __initZoom(){
        let _Dgram = this;
        //this.zoomReset();
        $( document ).on('mousewheel DOMMouseScroll', function( oEvent ){
            if( oEvent.shiftKey && _Dgram.__getDgramContainer().is( oEvent.target ) ){
                let _iDirection = ( oEvent.originalEvent.detail < 0 || oEvent.originalEvent.wheelDelta > 0 ) ? 1 : -1; // Positive means zooming
                _Dgram.zoom( _iDirection * 0.25, { bIsDelta: true } );
                oEvent.preventDefault();
            }
        });
    }

    zoomReset(){
        this.zoom( 1.0 );
    }

    zoom( fValue, oOptions ){
        oOptions = Object.assign({
            bIsDelta: false
        }, oOptions );
        let _oJSPlumbInstance = this.__getJSPlumbInstance();
        let fZoom = ( oOptions.bIsDelta ? ( this.__fZoom && !isNaN( this.__fZoom ) ? this.__fZoom : 1.0 ) + fValue : fValue );
        // Adding CSS to Container ( see: https://jsplumbtoolkit.com/community/doc/zooming.html )
        //let _aTransformOrigin = [ 0.5, 0.5 ],
        let    _oElement = _oJSPlumbInstance.getContainer(),
            _aBrowsers = [ "webkit", "moz", "ms", "o" ],
            sScale = "scale(" + fZoom + ")",
            // Using origina transform origin won't allow a correct conatiner's scroll
            //sTransformOrigin = ( _aTransformOrigin[ 0 ] * 100) + '% ' + ( _aTransformOrigin[ 1 ] * 100 ) + '%';
            sTransformOrigin = '0 0';
        _aBrowsers.forEach( function( sBrowserType ){
            _oElement.style[ sBrowserType + "Transform"] = sScale;
            _oElement.style[ sBrowserType + "TransformOrigin"] = sTransformOrigin;
        });
        _oElement.style.transform = sScale;
        _oElement.style.transformOrigin = sTransformOrigin;
        // Updating jsplumb
        _oJSPlumbInstance.setZoom( fZoom );
        this.__fZoom = fZoom;
    }

    paint(){
        let _oJSPlumb = this.__getJSPlumbInstance();
        _oJSPlumb.repaintEverything();
        this.__updateDraggable();
    }

    __initJSPlumb(){
        this.__oJsPlumb = jsPlumb.getInstance( {
            Container: this.__getDgramContainer(),
            // Connections
            Connector: 'StateMachine',
            ConnectionOverlays: [
                [ 'Arrow', {
                    location: 1,
                    id: 'arrow',
                    length: 14,
                    foldback: 0.8
                } ]
            ],
            // Other
            //LogEnabled: true,
            ReattachConnections: true
        } );
        // Init Events ( https://jsplumbtoolkit.com/community/doc/events.html )
        let Dgram = this;
        //this.__oJsPlumb.bind( 'connection', ( oData, oOriginalEvent ) => this.__onAttachConnection( oData, oOriginalEvent ) );
        //this.__oJsPlumb.bind( 'connectionDetached', ( oData, oOriginalEvent ) => this.__onDetachConnection( oData, oOriginalEvent ) );
        //this.__oJsPlumb.bind( 'connectionMoved', ( oData, oOriginalEvent ) => this.__onMoveConnection( oData, oOriginalEvent ) );
        // Before Drop
        this.__oJsPlumb.bind( 'beforeDrop', ( oData ) => this.__onBeforeDrop( oData ) );
        // Clicking over dgram element / Toggling select class
        this.__getDgramContainer().on( 'click', this.__oOptions.sDgramElementSelector, function(){ $(this).toggleClass( Dgram.__oOptions.sDgramElementSelectedClass ); } );
        // Pressing key ( using keydown since only printable keys tirgger keypress... )
        $(document).keydown( ( event ) => this.__onKeyPress( event ) );
    }

    __onBeforeDrop( oData ){
        let _oResult = ( oData.sourceId === oData.targetId ? null : oData );
        if( _oResult === null ){
          Ancilla.error( _LANG_CONFIGURATION_CANNOT_CONNECT_ITSELF );
        }
        return _oResult;
    }

    __onKeyPress( oEvent ){
        switch( oEvent.keyCode ){
            case 46: // Pressin "Delete" on keyboard
                let _jSelected = this.getDgramElements().filter( '.' + this.__oOptions.sDgramElementSelectedClass );
console.error( 'TODO: delete selected: ', _jSelected.size(), _jSelected );
            break;
        }
    }

    __initRubberBand(){
        this.__oRubberBand.jRubberBand = $('<div>',{
            class: 'rubberband',
            style: 'display: none;'
        });
        let _jContainer = this.__getContainer();
        _jContainer.append( this.__getRubberBand() );
        _jContainer.mousedown( ( event ) => this.__rubberBandMouseDown( event ) );
        _jContainer.mousemove( (event ) => this.__rubberBandMouseMove( event ) );
        _jContainer.mouseup( ( event ) => this.__rubberBandMouseUp( event ) );
        _jContainer.mouseleave( ( event ) => this.__rubberBandMouseUp( event ) );
        _jContainer.click( ( event ) => this.__rubberBandClick( event ) );
    }

    __getRubberBand(){
        return this.__oRubberBand.jRubberBand;
    }

    __rubberBandMouseDown(event) {
        this.__oRubberBand.oStartPoint.x = event.pageX;
        this.__oRubberBand.oStartPoint.y = event.pageY;
        this.__getRubberBand()
            .css({
                top: this.__oRubberBand.oStartPoint.y,
                left: this.__oRubberBand.oStartPoint.x,
                height:1,
                width:1,
                position:'absolute'
            })
            .show()
        ;
    }

    __rubberBandMouseMove(event) {
        if( this.__getRubberBand().is( ':visible' ) !== true ){
            return;
        }
        let wcalc = event.pageX - this.__oRubberBand.oStartPoint.x;
        let hcalc = event.pageY - this.__oRubberBand.oStartPoint.y;
        this.__getRubberBand()
            .css({
                top: ( ( event.pageY > this.__oRubberBand.oStartPoint.y ) ? this.__oRubberBand.oStartPoint.y : event.pageY ),
                left: ( (event.pageX >= this.__oRubberBand.oStartPoint.x) ? this.__oRubberBand.oStartPoint.x : event.pageX ),
                height: ( (event.pageY > this.__oRubberBand.oStartPoint.y) ? hcalc : (hcalc * -1) ),
                width: ( (event.pageX > this.__oRubberBand.oStartPoint.x) ? wcalc : (wcalc * -1) ),
                position:'absolute'
            })
        ;
    }

    __rubberBandMouseUp() {
        this.__rubberBandFindSelected();
        this.__getRubberBand()
            .hide()
        ;
    }

    __rubberBandFindSelected() {
        if( this.__getRubberBand().is( ':visible' ) !== true ){
            return;
        }
        let _oRubberBandOffset = this.__rubberBandGetTopLeftOffset( this.__getRubberBand() );
        let _Dgram = this;
        let _jElements = this.getDgramElements();
        _jElements.each( function(){
            let _jItem = $(this);
            var _oItemOffset = _Dgram.__rubberBandGetTopLeftOffset( _jItem );
            if( _oItemOffset.top > _oRubberBandOffset.top &&
                _oItemOffset.left > _oRubberBandOffset.left &&
                _oItemOffset.right < _oRubberBandOffset.right &&
                _oItemOffset.bottom < _oRubberBandOffset.bottom) {
                _jItem.addClass( _Dgram.__oOptions.sDgramElementSelectedClass );
                //let _sElementID = _jElement.attr('id');
                _Dgram.__getJSPlumbInstance().addToDragSelection( _jItem );
            }
        });
    }

    __rubberBandGetTopLeftOffset( element ){
        var _oElementDimensions = {};
        _oElementDimensions.left = element.offset().left;
        _oElementDimensions.top =  element.offset().top;
        _oElementDimensions.right = _oElementDimensions.left + element.outerWidth();
        _oElementDimensions.bottom = _oElementDimensions.top + element.outerHeight();
        return _oElementDimensions;
    }

    __rubberBandClick(event) {
        if( this.__oRubberBand.oStartPoint.x === event.pageX && this.__oRubberBand.oStartPoint.y === event.pageY ){
            this.__getJSPlumbInstance().clearDragSelection();
            let _Dgram = this;
            this.getDgramElements().each( function(){
                let _jItem = $(this);
                _jItem.removeClass( _Dgram.__oOptions.sDgramElementSelectedClass );
            });
        }
    }
}
