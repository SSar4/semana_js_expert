const { GestureDescription, Finger, FingerCurl } = window.fp;

const ScrollDownGesture = new GestureDescription("scroll-down"); // ✊️
const ScrollUpGesture = new GestureDescription("scroll-up"); // 🖐
const LoveGesture = new GestureDescription("Love"); //  🤟
// ScrollDown
// -----------------------------------------------------------------------------

// thumb: half curled
// accept no curl with a bit lower confidence
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

// all other fingers: curled
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  ScrollDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  ScrollDownGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

// Paper
// -----------------------------------------------------------------------------

// no finger should be curled
for (let finger of Finger.all) {
  ScrollUpGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

for (let finger of Finger.all) {
  ScrollUpGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

// Love
//------------------------------------------------------------------------------

// index and middle finger: stretched out
LoveGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
LoveGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
LoveGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
LoveGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
LoveGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);

const knowGestures = [ScrollDownGesture, ScrollUpGesture, LoveGesture];

const gestureStrings = {
  "scroll-down": "scroll-down",
  "scroll-up": "scroll-up",
  love: "love",
};
export { knowGestures, gestureStrings };
