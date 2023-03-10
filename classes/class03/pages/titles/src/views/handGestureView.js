export default class HandGestureView {
  #handsCanvas = document.querySelector('#hands')
  #canvasContext = this.#handsCanvas.getContext("2d")
  #fingerLookupIndices
  constructor({fingerLookupIndices}) {

    this.#handsCanvas.height = window.innerHeight;
    this.#fingerLookupIndices = fingerLookupIndices
  }
  clearCanvas() {
   
    this.#canvasContext.clearRect(0, 0, this.#handsCanvas.width, this.#handsCanvas.height)
  }
  drawResults(hands) {
    for (const { keypoints, handedness } of hands) {
      if (!keypoints) continue
      this.#canvasContext.fillStyle = handedness === "Left" ? "red" : "green"
      this.#canvasContext.strokeStyle = "white"
      this.#canvasContext.lineWidth = 8
      this.#canvasContext.lineJoin = "round"

      //juntas
      this.#drawJoients(keypoints)
      this.#drawFingersAndHoverElements(keypoints)
    }
  }

  #drawJoients(keypoints) {
    for (const { x, y } of keypoints) {
      this.#canvasContext.beginPath()
      const newX = x - 2
      const newY = y - 2
      const radius = 3
      const startAngle = 0
      const endAngle = 2 * Math.PI
      this.#canvasContext.arc(newX, newY, radius, startAngle, endAngle)
      this.#canvasContext.fill()
      
    }
  }

  clickOnElement(x,y) {
    const element = document.elementFromPoint(x, y)
    if (!element) return;
    const rect = element.getBoundingClientRect()
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: rect.left + x,
      clientY: rect.top + y
    })
    element.dispatchEvent(event)
  }

  #drawFingersAndHoverElements(keypoints) {
    const fingers = Object.keys(this.#fingerLookupIndices)
    for (const finger of fingers) {
      const points = this.#fingerLookupIndices[finger].map(index => keypoints[index])
      const region = new Path2D()
      const [{ x, y }] = points
      region.moveTo(x, y)
      for (const point of points) {
        region.lineTo(point.x, point.y)
      }
      this.#canvasContext.stroke(region)
    }
  }
  
  loop(fn) {
    requestAnimationFrame(fn);
  }

  scrollPage(top) {
    scroll({
      top,
      behavior: "smooth",
    });
  }
}
