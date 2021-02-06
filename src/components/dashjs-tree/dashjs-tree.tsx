import { Component, Host, h, Prop, State } from '@stencil/core';
import { Tree } from '../../types/types';

@Component({
  tag: 'dashjs-tree',
  styleUrl: 'dashjs-tree.css',
  shadow: true,
})
/**
 * Component for displaying a Tree recursively
 * Supply with a render Function and render anything you like inside
 */
export class DashjsTree {
  @Prop()
  tree: Tree;
  @Prop()
  elements: string[];
  @Prop() renderFunc: (key) => void;
  @Prop() renderFuncTitle: (path) => void;
  @Prop() renderFuncSuffix: () => void;

  @Prop() root: boolean = false;
  @Prop() path: string[] = [];
  @State() pathInitialized: boolean = false;
  @State() elementsOnRoot: string[];
  componentWillRender() {
    if (!this.root) {
      let regex = new RegExp(this.tree.name, 'i');
      this.elementsOnRoot = this.elements.filter(e => e.match(regex));
    } else {
      this.elementsOnRoot = this.elements;
    }
    if (!this.pathInitialized) {
      this.path = [...this.path.concat(this.tree.name)];
      this.pathInitialized = true;
    }
  }

  render() {
    if (this.elementsOnRoot.length == 0) {
      return undefined;
    }
    // debugger;
    return (
      <Host>
        {this.root ? undefined : this.renderFuncTitle == undefined ? <h3>{this.tree.name}</h3> : this.renderFuncTitle(this.path)}
        {/* {this.renderFuncTitle(this.tree.name, this.tree.elements)} */}
        {this.tree.elements.filter(el => this.elementsOnRoot.includes(el)).map(key => this.renderFunc(key))}
        {this.tree.child == undefined
          ? undefined
          : Object.keys(this.tree.child).map(key => (
              <dashjs-tree
                tree={this.tree.child[key]}
                elements={this.elementsOnRoot}
                renderFunc={this.renderFunc}
                renderFuncTitle={this.renderFuncTitle}
                renderFuncSuffix={this.renderFuncSuffix}
                path={this.path}
              ></dashjs-tree>
            ))}
        {this.root ? undefined : this.renderFuncSuffix == undefined ? <ion-item-divider></ion-item-divider> : this.renderFuncSuffix()}
      </Host>
    );
  }
}
