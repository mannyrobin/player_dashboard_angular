import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Node} from '../model/node';
import {Link} from '../model/link';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-ngx-graph',
  templateUrl: './ngx-graph.component.html',
  styleUrls: ['./ngx-graph.component.scss']
})
export class NgxGraphComponent {

  @Input()
  public links: Link[] = [];

  @Input()
  public nodes: Node[] = [];

  @Output()
  public readonly doubleClickLink = new EventEmitter<Link>();

  public readonly curve: any = shape.curveBundle.beta(1);

  public onDoubleClickLink(link: Link): void {
    this.doubleClickLink.emit(link);
  }

}
