import { default as Ancilla } from 'ancilla:Ancilla';
import {CoreViewModel} from '../core/classes/view-model';

// Extending Grid to be able to load objects on activate event
export class App extends CoreViewModel {

	// Configuring Child Router
	configureRouter(config, router){
		config.title = Ancilla.getConstant( '_LANG_MENU' );
		config.map([
			{ route: [ '', 'homepage' ], moduleId: './homepage',	nav: false, title: Ancilla.getConstant('_LANG_HOMEPAGE') },
			{ route: 'project', moduleId: './project', settings: { classCSS: 'fa-edit' }, nav: true, title: Ancilla.getConstant('_LANG_PROJECT') },
			{ route: 'network', moduleId: './network', settings: { classCSS: 'fa-wifi' }, nav: true, title: Ancilla.getConstant('_LANG_NETWORK') },
			{ route: 'support', moduleId: './support', settings: { classCSS: 'fa-terminal' }, nav: true, title: Ancilla.getConstant('_LANG_SUPPORT') }
		]);
    this.oRouter = router;
  }

	attached(){
		console.error( this.oRouter.navigation );
	}

}
