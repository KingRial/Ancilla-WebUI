import {CoreViewModel} from '../core/core.view-model'
import $ from 'jquery';
import Materialize from 'materialize';

export class App extends CoreViewModel{
	// Configuring Child Router
	configureRouter(config, router){
		config.title = Ancilla.getConstant( '_LANG_ADMINISTRATION' );
		config.map([
			{ route: '', moduleId: './homepage',	nav: false, title: Ancilla.getConstant( '_LANG_HOMEPAGE' ) },
			{ route: 'technologies', moduleId: './technologies', nav: true, title: Ancilla.getConstant( '_LANG_ADMINISTRATION_TECHNOLOGIES' ), classCSS: 'mdi-social-share' },
			{ route: 'technology/:id/', moduleId: './technology', nav: false, title: Ancilla.getConstant( '_LANG_ADMINISTRATION_TECHNOLOGY' ) }
		]);
    this.__oRouter = router;
  }

	attached(){
		$('.navigation-menu').sideNav({
			menuWidth: 300,
			edge: 'right',
			closeOnClick: true
		});
	}
}
