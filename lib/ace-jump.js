'use babel';

import AceJumpPaneOverlay from './ace-jump-pane-overlay';
import { CompositeDisposable } from 'atom';

export default {
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-pane', {
      'ace-jump:to-pane': () => this.jumpToPane()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {},

  focusPane(pane) {
    if (pane.isFocused()) return

    if (pane.constructor.name == 'TreeView') {
      atom.commands.dispatch(pane.getActiveItem(), 'tree-view:toggle-focus')
    } else {
      pane.focus()
    }
  },

  letters: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'g', 'h',
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
    'z', 'x', 'c', 'v', 'b', 'n', 'm'],

  jumpToPane() {
    const jumpablePanes = atom.workspace.getPanes().filter(pane => (
      pane.isAlive() && pane.getActiveItem()
      && pane.getActiveItem().constructor.name != 'PanelDock'
    ))

    if (jumpablePanes.length < 2) {
      return  // If there is no pane to jump to, do nothing.
    } else if (jumpablePanes.length == 2) {
      // If there is only one pane to jump to, jump to it immediately.
      this.focusPane(jumpablePanes[ jumpablePanes[0].isFocused() ? 1 : 0 ])
    } else {
      // Assign letter to each panel and add overlay.
      const paneOverlays = jumpablePanes.map(
        (pane, index) => new AceJumpPaneOverlay(pane, this.letters[index])
      )
      // Listen to any key.
      const captureKeyDown = (e) => {
        e.stopImmediatePropagation()  // Stops propagating of event.
        e.preventDefault()  // Stops triggering of other events (keypress, keyup).
        // Remove overlays from all panes.
        paneOverlays.forEach(overlay => {
          if (overlay.getLetter() == e.key) this.focusPane(overlay.getPane())
          overlay.destroy()
        })
        window.removeEventListener('keydown', captureKeyDown, true)
      }
      window.addEventListener('keydown', captureKeyDown, true)
    }
  }

};
