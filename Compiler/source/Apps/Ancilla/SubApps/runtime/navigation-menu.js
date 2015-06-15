import {customElement,bindable} from 'aurelia-framework';
import {CoreViewModel} from '../core/core.view-model'
import $ from 'jquery';
import Materialize from 'materialize';

@customElement('navigation-menu')
export class NavigationMenu extends CoreViewModel{

	@bindable item;
  @bindable router;

	attached(){
		$('.navigation-menu').sideNav({
			menuWidth: 300,
			edge: 'right',
			closeOnClick: true
		});
	}
/*
	updateItem(){
		var _iID = parseInt( this.router.currentInstruction.params.id );
		this.item = Ancilla.getObj( _iID );
console.error( 'ID: %o %o', this.router, _iID, this.item );
	}
*/
  jumpTo( oJumpToMenuItem ){
    var _sURL = '#' + oJumpToMenuItem.getURL() + '/' + oJumpToMenuItem.getID();
    window.location = _sURL;
  }

}
