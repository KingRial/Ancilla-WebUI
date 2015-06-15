import {customElement,bindable} from 'aurelia-framework';
import {CoreViewModel} from './SubApps/core/core.view-model';
import './CSSs/main.css!';

@customElement('app-message')
export class AppMessage extends CoreViewModel{

	@bindable message;
	@bindable when;

}
