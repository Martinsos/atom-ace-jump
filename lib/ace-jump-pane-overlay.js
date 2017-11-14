'use babel'

export default class AceJumpPaneOverlay {

  constructor(pane, letter) {
    this.letter = letter
    this.pane = pane

    this.element = document.createElement('div')
    this.element.classList.add(this.getOverlayClassName())
    this.element.textContent = letter

    pane.getElement().appendChild(this.element)
  }

  destroy = () => {
    this.element.remove()
  }

  getOverlayClassName = () => {
    return 'ace-jump_pane-overlay'
  }

  getElement = () => {
    return this.element
  }
  getPane = () => {
    return this.pane
  }
  getLetter = () => {
    return this.letter
  }

}
