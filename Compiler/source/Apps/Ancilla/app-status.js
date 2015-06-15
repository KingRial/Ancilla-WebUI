import {customElement,bindable} from 'aurelia-framework';
import {CoreViewModel} from './SubApps/core/core.view-model';
import $ from 'jquery';
import Materialize from 'materialize';
import './CSSs/main.css!';

@customElement('app-status')
export class AppStatus extends CoreViewModel{

	__sCurrentProjectName = this.getConstant( '_LANG_UNKNOWN' );
	__sCurrentAddress = Ancilla.getServerAddress();

	__sProjectName = null;
	__sLocalAddress = null;
	__sRemoteAddress = null;
	__oConfiguredProjects = [];

	constructor(){
		super();
		var _oFoundProject = this.__selectProject( this.__sCurrentAddress );
	}

	attached(){
		$('.app-status').sideNav({
			menuWidth: 300
		});
		$('.collapsible').collapsible();
	}

	__selectProject( sAddress ){
		for( var _iIndex in this.__oConfiguredProjects ){
			var _oCurrentProject = this.__oConfiguredProjects[ _iIndex ];
			_oCurrentProject.bSelected = ( _oCurrentProject.sLocalAddress == sAddress || _oCurrentProject.sRemoteAddress == sAddress );
		}
	}

	__findProjectIndexFromList( sAddress ){
		for( var _iIndex in this.__oConfiguredProjects ){
			var _oCurrentProject = this.__oConfiguredProjects[ _iIndex ];
			if( _oCurrentProject.sLocalAddress == sAddress || _oCurrentProject.sRemoteAddress == sAddress ){
				return _iIndex;
			}
		}
		return null;
	}

	addProject(){
		if( !this.__sProjectName || !this.__sLocalAddress || !this.__sRemoteAddress ){
			this.error( 'TODO: error: empty fields: %o %o %o', this.__sProjectName, this.__sLocalAddress, this.__sRemoteAddress );
		} else if( this.__findProjectIndexFromList( this.__sLocalAddress ) ){
			this.error( 'TODO: error message: project already created with local address' );
		} else if( this.__findProjectIndexFromList( this.__sRemoteAddress ) ){
			this.error( 'TODO: error message: project already created with remote address' );
		} else {
			this.__oConfiguredProjects.push( { sLabel: this.__sProjectName, sLocalAddress: this.__sLocalAddress, sRemoteAddress: this.__sRemoteAddress, bSelected: false });
		}
	}

	removeProject(oProject){
		console.error( 'TODO: remove: %o', oProject );
	}

	setAddressProject( sAddress ){
		console.error( 'Set Address project: %o', sAddress );
		Ancilla.setServerAddress( sAddress );
	}

}
