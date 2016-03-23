import {bindable} from 'aurelia-framework';
import {CoreComponentWidget} from '../../core/components/widget';

export class Widget extends CoreComponentWidget {
  @bindable dgram;
}
