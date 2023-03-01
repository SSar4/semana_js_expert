import { prepareRunChecker } from "../../../../lib/shared/util.js";

const { shouldRun: scrollShouldRun } = prepareRunChecker({ timerDelay: 200 });
export default class HandGestureContoller {
  #view;
  #service;
  #camera;
  #lastDirection = {
    direction: "",
    y: 0,
  };
  constructor({ view, service, camera }) {
    this.#view = view;
    this.#service = service;
    this.#camera = camera;
  }
  async init() {
    await this.#loop();
  }

  #scrollPage(direction) {
    const pixelsPerScroll = 400;
    if (this.#lastDirection.direction === direction) {
      this.#lastDirection.y =
        direction === "scroll-down"
          ? this.#lastDirection.y + pixelsPerScroll
          : this.#lastDirection.y - pixelsPerScroll;
    } else {
      this.#lastDirection.direction = direction;
    }
    this.#view.scrollPage(this.#lastDirection.y);
  }
  async #estimateHands() {
    try {
      const hands = await this.#service.estimateHands(this.#camera.video);
      for await (const { event, x, y } of this.#service.detectGesture(hands)) {
        if (event.includes("scroll")) {
          if (!scrollShouldRun()) continue;
          this.#scrollPage(event);
        }

        if (hands?.length === 2) console.log("🖐🖐");
        if (hands?.length === 1) console.log("🖐", hands[0].handedness);
      }
    } catch (error) {
      console.error("error", error);
    }
  }

  async #loop() {
    await this.#service.initializeDetector();
    await this.#estimateHands();
    //o view é deste contexto
    this.#view.loop(this.#loop.bind(this));
  }

  static async initialize(deps) {
    const controller = new HandGestureContoller(deps);
    return controller.init();
  }
}
