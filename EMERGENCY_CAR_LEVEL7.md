# Level 7 — Emergency Car (Car A)

## New YOUTH Robot → Lights blocks
- `emergency car`: starts flashing red/blue lights AND a looping two-tone ambulance siren. **Non-blocking** (radio/button events keep working).
- `stop emergency car`: turns off flashing lights and stops the siren.

## Car A (Ambulance) — MakeCode JavaScript
```typescript
radio.setGroup(7)
input.onButtonPressed(Button.A, function () {
    radio.sendString("AMB")
    youthCar.emergencyCar()
})
input.onButtonPressed(Button.B, function () {
    youthCar.stopEmergencyCar()
})
```

## Car B (Normal Car) — MakeCode JavaScript
```typescript
radio.setGroup(7)
input.onButtonPressed(Button.B, function () {
    youthCar.drive(YouthDir.Forward, 20)
})
radio.onReceivedString(function (receivedString) {
    if (receivedString == "AMB") {
        youthCar.stop()
        youthCar.turnSignal(YouthSide.Right, 3)
        basic.pause(3000)
        youthCar.drive(YouthDir.Forward, 20)
    }
})
```

## Upload to your existing GitHub repository
1. Back up the repository or use a new branch.
2. Replace root `car.ts` and `pxt.json` with the files in this zip; retain all other source files.
3. Commit the changes; refresh/reload the extension in MakeCode.
4. Confirm the new blocks appear under **YOUTH Robot → Lights**.

## Caveats
- Tested by source review and TypeScript syntax validation only; not compiled with the MakeCode PXT toolchain nor tested on the actual car.
- This uses the micro:bit speaker/buzzer music output; do not run other melodies at the same time.
- Emergency sounds repeat until stopped; turn off with Button B. Motor motion is not affected.
