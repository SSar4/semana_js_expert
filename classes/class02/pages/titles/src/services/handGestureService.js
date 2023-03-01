import { gestureStrings, knowGestures } from "../utils/gestures.js";
export default class HandGestureService {
  #gestureEstimator;
  #handPoseDetection;
  #handsVersion;
  #detector = null;

  constructor({ fingerpose, handPoseDetection }) {
    this.#gestureEstimator = new fingerpose.GestureEstimator(knowGestures);
    this.#handPoseDetection = handPoseDetection;
    this.#handsVersion = "0.4.1646424915";
  }

  async estimate(keypoints3D) {
    const predictions = await this.#gestureEstimator.estimate(
      this.#getLandMarksFromKeypoints(keypoints3D),
      9
    );
    return predictions.gestures;
  }

  async *detectGesture(predictions) {
    for (const hands of predictions) {
      if (!hands.keypoints3D) continue;
      const gestures = await this.estimate(hands.keypoints3D);
      if (!gestures.length) continue;
      const result = gestures.reduce((previous, currently) =>
        previous.score > currently.score ? previous : currently
      );
      const { x, y } = hands.keypoints.find(
        (keypoints) => keypoints.name === "index_finger_tip"
      );
      yield { event: result.name, x, y };
      console.log("detected ", result.name, gestureStrings[result.name], x, y);
    }
  }

  #getLandMarksFromKeypoints(keypoints3D) {
    return keypoints3D.map((keypoints) => [
      keypoints.x,
      keypoints.y,
      keypoints.z,
    ]);
  }

  async estimateHands(video) {
    return this.#detector.estimateHands(video, {
      flipHorizontal: true,
    });
  }
  async initializeDetector() {
    if (this.#detector) return this.#detector;
    console.log(this.#handsVersion);
    const detectorConfig = {
      runtime: "mediapipe", // or 'tfjs',
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${
        this.#handsVersion
      }`,
      modelType: "lite",
      maxHands: 2,
    };
    this.#detector = await this.#handPoseDetection.createDetector(
      this.#handPoseDetection.SupportedModels.MediaPipeHands,
      detectorConfig
    );

    return this.#detector;
  }
}
