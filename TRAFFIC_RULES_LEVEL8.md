# Traffic Rules — Level 8 (Age 14)

## What changed
- Added **Sensors → `stop marker detected?`**. Existing line-sensor values and `follow the line` blocks are unchanged.
- Added optional **Setup → `reset stop marker detector`** block.
- A STOP is **not** detected merely because both sensors see black. The new block requires a white gap (both sensors white for at least 100 ms) followed by both sensors black within 1.8 seconds.

## Track (same 2 cm or 3 cm normal black line)
Direction: car drives along normal black line, encounters a short **white gap** (a full break in the black line), then a **wide black crossbar** covering both sensors. Begin with a gap around 2–4 cm; adjust experimentally to speed/surface. Because some line-following code struggles in a gap, test slowly (around 15%). The crossbar should be wide enough across the track to cover both sensors and long enough in travel direction to register; avoid extending it so far that the robot cannot leave it.

## Beginner MakeCode Blocks
1. Forever
2. If `distance (cm) < 15`: stop; red underglow.
3. Else if `stop marker detected?`: stop; yellow underglow; pause 3000 ms; drive forward 20% for 0.3 seconds (adjust to clear marker).
4. Else: green underglow; follow the line at 15%.

## Important
- NOT a universal line/stop classifier: it recognises a designed **white-gap + black-crossbar** track pattern. Unexpected white gaps and lost lines can cause false triggers.
- The function must be called repeatedly inside forever during normal driving. It is non-blocking; it returns `true` once per valid marker. It does not stop the motors itself.
- Gap time (100 ms), maximum wait (1800 ms), and cooldown (1500 ms) are internal starter settings; adjust in `car.ts` if needed.
- During `pause 3000 ms`, obstacle detection is not polled by the student's forever loop. Supervise the car; test in clear space.
- If the extension is already installed from GitHub, publish these files to a GitHub repository and use its URL in MakeCode Extensions; **the source ZIP alone isn't a directly installable MakeCode Extension**.
- Not tested on physical hardware; test with your actual car before class.
