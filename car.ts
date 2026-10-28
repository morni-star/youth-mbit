/**
 * YOUTH Car — blocks for the Yahboom m:bit Smart Robot Car.
 * Part of the YOUTH mBit pack (YOUTH Computer Tachileik Robotics).
 * Hardware map taken from the Yahboom mbit extension v3.0.5:
 *   PCA9685 @0x41: headlight R/G/B = ch0/1/2, servo S1–S3 = ch3–5,
 *   left motor = ch12 (fwd) / ch13 (back), right motor = ch15 (fwd) / ch14 (back)
 *   Ultrasonic Trig P14 / Echo P15 · Line sensor Left P2 / Right P1
 *   IR avoid sensor P3 (enable P9) · NeoPixel ×3 on P16 · Buzzer = micro:bit music
 */

enum YouthDir {
    //% block="forward"
    Forward = 1,
    //% block="backward"
    Backward = 2
}

enum YouthSide {
    //% block="left"
    Left = 0,
    //% block="right"
    Right = 1
}

enum YouthColor {
    //% block="red"
    Red = 0xFF0000,
    //% block="green"
    Green = 0x00FF00,
    //% block="blue"
    Blue = 0x0000FF,
    //% block="yellow"
    Yellow = 0xFFFF00,
    //% block="white"
    White = 0xFFFFFF,
    //% block="cyan"
    Cyan = 0x00FFFF,
    //% block="magenta"
    Magenta = 0xFF00FF,
    //% block="orange"
    Orange = 0xFF6000,
    //% block="off"
    Off = 0x000000
}

enum YouthLineColor {
    //% block="black"
    Black = 1,
    //% block="white"
    White = 0
}

enum YouthLinePos {
    //% block="both sensors on the line"
    Both = 0,
    //% block="line on the left"
    Left = 1,
    //% block="line on the right"
    Right = 2,
    //% block="line lost"
    Lost = 3
}

enum YouthServo {
    S1 = 1,
    S2 = 2,
    S3 = 3
}

enum YouthGate {
    //% block="open"
    Open = 0,
    //% block="close"
    Close = 1
}

enum YouthCarSound {
    //% block="horn"
    Horn = 0,
    //% block="reverse beep"
    Reverse = 1,
    //% block="ambulance siren"
    Ambulance = 2,
    //% block="police siren"
    Police = 3,
    //% block="engine start"
    Engine = 4
}

//% color="#E85D1F" weight=100 icon="" block="YOUTH Robot"
//% groups='["Move", "Smart Moves", "Lights", "Sensors", "Events", "Servo", "Setup"]'
namespace youthCar {
    const PCA_ADDR = 0x41
    let pcaReady = false
    let strip: neopixel.Strip = null

    // calibration (Trainer can change with the Setup blocks)
    let distanceFactor = 1.0
    let turn90Ms = 400
    let turnSpeed = 50
    let lineThreshold = 500
    let avoidThreshold = 800
    let cmPerSecAt50 = 20
    let darkLevel = 30

    // ---------- low level ----------
    function i2cWrite(reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(PCA_ADDR, buf)
    }

    function i2cRead(reg: number): number {
        pins.i2cWriteNumber(PCA_ADDR, reg, NumberFormat.UInt8BE)
        return pins.i2cReadNumber(PCA_ADDR, NumberFormat.UInt8BE)
    }

    function initPca() {
        i2cWrite(0x00, 0x00)
        // 50 Hz for servos
        let prescale = Math.floor(25000000 / 4096 / 50 - 1)
        let oldMode = i2cRead(0x00)
        i2cWrite(0x00, (oldMode & 0x7F) | 0x10)
        i2cWrite(0xFE, prescale)
        i2cWrite(0x00, oldMode)
        control.waitMicros(5000)
        i2cWrite(0x00, oldMode | 0xA1)
        pcaReady = true
    }

    function setPwm(channel: number, off: number) {
        if (!pcaReady) initPca()
        off = Math.constrain(Math.round(off), 0, 4095)
        let buf = pins.createBuffer(5)
        buf[0] = 0x06 + 4 * channel
        buf[1] = 0
        buf[2] = 0
        buf[3] = off & 0xFF
        buf[4] = (off >> 8) & 0xFF
        pins.i2cWriteBuffer(PCA_ADDR, buf)
    }

    function motor(fwdCh: number, backCh: number, percent: number) {
        percent = Math.constrain(percent, -100, 100)
        let duty = Math.abs(percent) * 4095 / 100
        if (percent >= 0) {
            setPwm(backCh, 0)
            setPwm(fwdCh, duty)
        } else {
            setPwm(fwdCh, 0)
            setPwm(backCh, duty)
        }
    }

    function getStrip(): neopixel.Strip {
        if (!strip) strip = neopixel.create(DigitalPin.P16, 3, NeoPixelMode.RGB)
        return strip
    }

    // ---------- Move ----------

    /**
     * Set each wheel speed from -100 (backward) to 100 (forward).
     */
    //% blockId=youth_set_wheels block="set wheels left %left \\% right %right \\%"
    //% left.min=-100 left.max=100 left.defl=50
    //% right.min=-100 right.max=100 right.defl=50
    //% group="Move" weight=60 advanced=false
    export function setWheels(left: number, right: number): void {
        motor(12, 13, left)
        motor(15, 14, right)
    }

    /**
     * Drive for a number of seconds, then stop.
     */
    //% blockId=youth_drive_for block="drive %dir at %speed \\% for %seconds sec"
    //% speed.min=0 speed.max=100 speed.defl=50
    //% seconds.defl=1
    //% group="Move" weight=100
    export function driveFor(dir: YouthDir, speed: number, seconds: number): void {
        drive(dir, speed)
        basic.pause(seconds * 1000)
        stop()
    }

    /**
     * Keep driving until another Move block runs.
     */
    //% blockId=youth_drive block="drive %dir at %speed \\%"
    //% speed.min=0 speed.max=100 speed.defl=50
    //% group="Move" weight=95
    export function drive(dir: YouthDir, speed: number): void {
        let s = dir == YouthDir.Forward ? speed : -speed
        setWheels(s, s)
    }

    /**
     * Turn on the spot by an angle. Uses the 90° calibration from Setup.
     */
    //% blockId=youth_turn block="turn %side %degrees °"
    //% degrees.min=0 degrees.max=360 degrees.defl=90
    //% group="Move" weight=90
    export function turn(side: YouthSide, degrees: number): void {
        spin(side, turnSpeed)
        basic.pause(turn90Ms * degrees / 90)
        stop()
    }

    /**
     * Keep spinning on the spot.
     */
    //% blockId=youth_spin block="spin %side at %speed \\%"
    //% speed.min=0 speed.max=100 speed.defl=50
    //% group="Move" weight=85
    export function spin(side: YouthSide, speed: number): void {
        if (side == YouthSide.Left) setWheels(-speed, speed)
        else setWheels(speed, -speed)
    }

    /**
     * Curve like a car: one wheel slower than the other.
     */
    //% blockId=youth_curve block="curve %side at %speed \\% for %seconds sec"
    //% speed.min=0 speed.max=100 speed.defl=50 seconds.defl=1
    //% group="Move" weight=80
    export function curve(side: YouthSide, speed: number, seconds: number): void {
        if (side == YouthSide.Left) setWheels(speed / 3, speed)
        else setWheels(speed, speed / 3)
        basic.pause(seconds * 1000)
        stop()
    }

    //% blockId=youth_stop block="stop"
    //% group="Move" weight=75
    export function stop(): void {
        setWheels(0, 0)
    }

    // ---------- Lights ----------

    //% blockId=youth_headlight block="headlight %color"
    //% color.fieldEditor="gridpicker" color.fieldOptions.columns=3
    //% group="Lights" weight=100
    export function headlight(color: YouthColor): void {
        headlightRGB((color >> 16) & 0xFF, (color >> 8) & 0xFF, color & 0xFF)
    }

    //% blockId=youth_headlight_rgb block="headlight red %r green %g blue %b"
    //% r.min=0 r.max=255 g.min=0 g.max=255 b.min=0 b.max=255
    //% group="Lights" weight=95
    export function headlightRGB(r: number, g: number, b: number): void {
        setPwm(0, r * 16)
        setPwm(1, g * 16)
        setPwm(2, b * 16)
    }

    /**
     * Color all three lights under the car.
     */
    //% blockId=youth_underglow block="underglow lights %color"
    //% color.fieldEditor="gridpicker" color.fieldOptions.columns=3
    //% group="Lights" weight=90
    export function underglow(color: YouthColor): void {
        getStrip().showColor(color)
    }

    //% blockId=youth_underglow_one block="underglow light %index %color"
    //% index.min=1 index.max=3 index.defl=1
    //% color.fieldEditor="gridpicker" color.fieldOptions.columns=3
    //% group="Lights" weight=85
    export function underglowOne(index: number, color: YouthColor): void {
        let s = getStrip()
        s.setPixelColor(Math.constrain(index, 1, 3) - 1, color)
        s.show()
    }

    /**
     * Blink yellow and show an arrow, like a car indicator.
     */
    //% blockId=youth_turn_signal block="turn signal %side blink %times times"
    //% times.min=1 times.max=20 times.defl=3
    //% group="Lights" weight=80
    export function turnSignal(side: YouthSide, times: number): void {
        for (let i = 0; i < times; i++) {
            basic.showArrow(side == YouthSide.Left ? ArrowNames.West : ArrowNames.East, 0)
            headlight(YouthColor.Orange)
            basic.pause(300)
            basic.clearScreen()
            headlight(YouthColor.Off)
            basic.pause(300)
        }
    }

    //% blockId=youth_lights_off block="all lights off"
    //% group="Lights" weight=75
    export function lightsOff(): void {
        headlight(YouthColor.Off)
        getStrip().clear()
        getStrip().show()
    }

    // ---------- Sound (car shortcuts; more in YOUTH Music) ----------

    /**
     * Play a car sound effect and wait until it finishes.
     */
    //% blockId=youth_car_sound block="car sound %sound"
    //% group="Lights" weight=70
    export function carSound(sound: YouthCarSound): void {
        switch (sound) {
            case YouthCarSound.Horn: youthMusic.playEffect(YouthSfx.Horn); break
            case YouthCarSound.Reverse: youthMusic.playEffect(YouthSfx.Reverse); break
            case YouthCarSound.Ambulance: youthMusic.playEffect(YouthSfx.Ambulance); break
            case YouthCarSound.Police: youthMusic.playEffect(YouthSfx.Police); break
            case YouthCarSound.Engine: youthMusic.playEffect(YouthSfx.Engine); break
        }
    }

    // ---------- Sensors ----------

    /**
     * Distance in cm from the ultrasonic sensor (0–400). 400 means nothing in front.
     */
    //% blockId=youth_distance block="distance (cm)"
    //% group="Sensors" weight=100
    export function distance(): number {
        let reads: number[] = []
        for (let i = 0; i < 5; i++) {
            pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
            pins.digitalWritePin(DigitalPin.P14, 0)
            control.waitMicros(2)
            pins.digitalWritePin(DigitalPin.P14, 1)
            control.waitMicros(10)
            pins.digitalWritePin(DigitalPin.P14, 0)
            let d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 25000)
            reads.push(d == 0 ? 400 : Math.min(400, d / 58))
            basic.pause(10)
        }
        reads.sort((a, b) => a - b)
        return Math.round(reads[2] * distanceFactor)
    }

    /**
     * True when the front IR sensor sees something very close (a few cm).
     */
    //% blockId=youth_obstacle block="obstacle in front?"
    //% group="Sensors" weight=95
    export function obstacleAhead(): boolean {
        pins.setPull(DigitalPin.P9, PinPullMode.PullUp)
        pins.digitalWritePin(DigitalPin.P9, 0)
        control.waitMicros(100)
        let v = pins.analogReadPin(AnalogPin.P3)
        pins.digitalWritePin(DigitalPin.P9, 1)
        return v < avoidThreshold
    }

    //% blockId=youth_line_sees block="%side line sensor sees %color"
    //% group="Sensors" weight=90
    export function lineSees(side: YouthSide, color: YouthLineColor): boolean {
        let v = side == YouthSide.Left ? pins.analogReadPin(AnalogPin.P2) : pins.analogReadPin(AnalogPin.P1)
        let isWhite = v < lineThreshold
        return color == YouthLineColor.White ? isWhite : !isWhite
    }

    //% blockId=youth_line_pos block="%pos"
    //% group="Sensors" weight=85
    export function lineIs(pos: YouthLinePos): boolean {
        let l = lineSees(YouthSide.Left, YouthLineColor.Black)
        let r = lineSees(YouthSide.Right, YouthLineColor.Black)
        switch (pos) {
            case YouthLinePos.Both: return l && r
            case YouthLinePos.Left: return l && !r
            case YouthLinePos.Right: return !l && r
            default: return !l && !r
        }
    }

    //% blockId=youth_is_dark block="it is dark?"
    //% group="Sensors" weight=80
    export function isDark(): boolean {
        return input.lightLevel() < darkLevel
    }

    // ---------- Events ----------
    let nearHandlers: (() => void)[] = []
    let nearLimits: number[] = []
    let nearWasClose: boolean[] = []
    let lineHandlers: (() => void)[] = []
    let linePos: YouthLinePos[] = []
    let lineWas: boolean[] = []
    let watching = false

    function startWatching() {
        if (watching) return
        watching = true
        control.inBackground(function () {
            while (true) {
                if (nearHandlers.length > 0) {
                    let d = distance()
                    for (let i = 0; i < nearHandlers.length; i++) {
                        let close = d < nearLimits[i]
                        if (close && !nearWasClose[i]) nearHandlers[i]()
                        nearWasClose[i] = close
                    }
                }
                for (let j = 0; j < lineHandlers.length; j++) {
                    let now = lineIs(linePos[j])
                    if (now && !lineWas[j]) lineHandlers[j]()
                    lineWas[j] = now
                }
                basic.pause(30)
            }
        })
    }

    /**
     * Runs once each time something comes closer than the distance.
     */
    //% blockId=youth_on_near block="when something is closer than %cm cm"
    //% cm.defl=20 cm.min=2 cm.max=200
    //% group="Events" weight=100
    export function onCloserThan(cm: number, handler: () => void): void {
        nearHandlers.push(handler)
        nearLimits.push(cm)
        nearWasClose.push(false)
        startWatching()
    }

    /**
     * Runs once each time the line sensors change to this state.
     */
    //% blockId=youth_on_line block="when %pos"
    //% group="Events" weight=95
    export function onLine(pos: YouthLinePos, handler: () => void): void {
        lineHandlers.push(handler)
        linePos.push(pos)
        lineWas.push(false)
        startWatching()
    }

    // ---------- Servo ----------

    //% blockId=youth_servo block="servo %servo to %angle °"
    //% angle.min=0 angle.max=180 angle.defl=90
    //% group="Servo" weight=100
    export function servo(servo: YouthServo, angle: number): void {
        let us = Math.constrain(angle, 0, 180) * 1800 / 180 + 600
        setPwm(servo + 2, us * 4096 / 20000)
    }

    /**
     * Open or close a door / parking gate made with a servo.
     */
    //% blockId=youth_gate block="gate on %servo %action"
    //% group="Servo" weight=95
    export function gate(servo: YouthServo, action: YouthGate): void {
        youthCar.servo(servo, action == YouthGate.Open ? 90 : 0)
    }

    // ---------- Smart Moves ----------

    /**
     * Drive a distance in cm. Uses the drive calibration from Setup.
     */
    //% blockId=youth_drive_cm block="drive %dir %cm cm"
    //% cm.defl=30 cm.min=1 cm.max=500
    //% group="Smart Moves" weight=100
    export function driveCm(dir: YouthDir, cm: number): void {
        driveFor(dir, 50, cm / cmPerSecAt50)
    }

    /**
     * Drive forward and stop when something is closer than the distance.
     * Gives up after the time limit so the robot never runs away.
     */
    //% blockId=youth_drive_until block="drive forward at %speed \\% until closer than %cm cm || or %seconds sec"
    //% speed.defl=40 speed.min=0 speed.max=100 cm.defl=15 seconds.defl=10
    //% expandableArgumentMode="toggle"
    //% group="Smart Moves" weight=95
    export function driveUntilCloser(speed: number, cm: number, seconds?: number): void {
        let limit = control.millis() + (seconds ? seconds : 10) * 1000
        drive(YouthDir.Forward, speed)
        while (distance() >= cm && control.millis() < limit) basic.pause(20)
        stop()
    }

    /**
     * One step of line following — put it inside "forever".
     */
    //% blockId=youth_follow_step block="follow the line at %speed \\%"
    //% speed.defl=40 speed.min=0 speed.max=100
    //% group="Smart Moves" weight=90
    export function followLine(speed: number): void {
        if (lineIs(YouthLinePos.Both)) setWheels(speed, speed)
        else if (lineIs(YouthLinePos.Left)) setWheels(-speed / 2, speed)
        else if (lineIs(YouthLinePos.Right)) setWheels(speed, -speed / 2)
        else setWheels(speed / 2, speed / 2)
    }

    //% blockId=youth_follow_for block="follow the line at %speed \\% for %seconds sec"
    //% speed.defl=40 speed.min=0 speed.max=100 seconds.defl=5
    //% group="Smart Moves" weight=85
    export function followLineFor(speed: number, seconds: number): void {
        let end = control.millis() + seconds * 1000
        while (control.millis() < end) {
            followLine(speed)
            basic.pause(5)
        }
        stop()
    }

    /**
     * Follow the line until both sensors see a cross line (a "station"), then stop.
     */
    //% blockId=youth_follow_station block="follow the line at %speed \\% to the next station"
    //% speed.defl=40 speed.min=0 speed.max=100
    //% group="Smart Moves" weight=80
    export function followToStation(speed: number): void {
        // leave the current station first
        let guard = control.millis() + 2000
        while (lineIs(YouthLinePos.Both) && control.millis() < guard) { setWheels(speed, speed); basic.pause(5) }
        let limit = control.millis() + 30000
        while (control.millis() < limit) {
            if (lineIs(YouthLinePos.Both)) {
                basic.pause(40)
                if (lineIs(YouthLinePos.Both)) break
            }
            followLine(speed)
            basic.pause(5)
        }
        stop()
    }

    /**
     * Drive a square, triangle or any regular shape.
     */
    //% blockId=youth_shape block="drive a shape with %sides sides of %cm cm"
    //% sides.defl=4 sides.min=3 sides.max=12 cm.defl=30
    //% group="Smart Moves" weight=75
    export function driveShape(sides: number, cm: number): void {
        for (let i = 0; i < sides; i++) {
            driveCm(YouthDir.Forward, cm)
            turn(YouthSide.Right, 360 / sides)
        }
    }

    // ---------- More Lights ----------

    //% blockId=youth_rainbow block="underglow rainbow"
    //% group="Lights" weight=72
    export function rainbow(): void {
        let s = getStrip()
        s.showRainbow(1, 360)
    }

    //% blockId=youth_underglow_brightness block="underglow brightness %percent \\%"
    //% percent.defl=50 percent.min=0 percent.max=100
    //% group="Lights" weight=71
    export function underglowBrightness(percent: number): void {
        getStrip().setBrightness(Math.constrain(percent, 0, 100) * 255 / 100)
        getStrip().show()
    }

    /**
     * Flash red and blue like an emergency vehicle.
     */
    //% blockId=youth_emergency_lights block="emergency lights for %seconds sec"
    //% seconds.defl=3
    //% group="Lights" weight=69
    export function emergencyLights(seconds: number): void {
        let end = control.millis() + seconds * 1000
        let red = true
        while (control.millis() < end) {
            headlight(red ? YouthColor.Red : YouthColor.Blue)
            underglow(red ? YouthColor.Blue : YouthColor.Red)
            red = !red
            basic.pause(200)
        }
        lightsOff()
    }

    // ---------- More Events ----------
    let obstacleHandler: () => void = null
    let darkHandler: () => void = null

    /**
     * Runs once each time the front IR sensor starts seeing something.
     */
    //% blockId=youth_on_obstacle block="when obstacle appears in front"
    //% group="Events" weight=90
    export function onObstacle(handler: () => void): void {
        obstacleHandler = handler
        control.inBackground(function () {
            let was = false
            while (true) {
                let now = obstacleAhead()
                if (now && !was && obstacleHandler) obstacleHandler()
                was = now
                basic.pause(50)
            }
        })
    }

    //% blockId=youth_on_dark block="when it gets dark"
    //% group="Events" weight=85
    export function onDark(handler: () => void): void {
        darkHandler = handler
        control.inBackground(function () {
            let was = false
            while (true) {
                let now = isDark()
                if (now && !was && darkHandler) darkHandler()
                was = now
                basic.pause(200)
            }
        })
    }

    //% blockId=youth_servo_sweep block="servo %servo sweep from %from ° to %to ° in %ms ms"
    //% from.defl=0 to.defl=180 ms.defl=1000
    //% group="Servo" weight=90
    export function servoSweep(servo: YouthServo, from: number, to: number, ms: number): void {
        let steps = 30
        for (let i = 0; i <= steps; i++) {
            youthCar.servo(servo, from + (to - from) * i / steps)
            basic.pause(ms / steps)
        }
    }

    // ---------- Setup (Trainer) ----------

    /**
     * Multiply distance readings so they match a ruler (1 = no change).
     */
    //% blockId=youth_cal_distance block="calibrate distance × %factor"
    //% factor.defl=1
    //% group="Setup" weight=100 advanced=true
    export function calibrateDistance(factor: number): void {
        distanceFactor = factor
    }

    /**
     * How long (ms) a 90° turn takes at the given speed on your floor.
     */
    //% blockId=youth_cal_turn block="calibrate 90° turn = %ms ms at %speed \\%"
    //% ms.defl=400 speed.defl=50 speed.min=10 speed.max=100
    //% group="Setup" weight=95 advanced=true
    export function calibrateTurn(ms: number, speed: number): void {
        turn90Ms = ms
        turnSpeed = speed
    }

    //% blockId=youth_cal_line block="set line sensor threshold %value"
    //% value.defl=500 value.min=0 value.max=1023
    //% group="Setup" weight=90 advanced=true
    export function setLineThreshold(value: number): void {
        lineThreshold = value
    }

    //% blockId=youth_raw_line block="raw line value %side"
    //% group="Setup" weight=85 advanced=true
    export function rawLine(side: YouthSide): number {
        return side == YouthSide.Left ? pins.analogReadPin(AnalogPin.P2) : pins.analogReadPin(AnalogPin.P1)
    }

    /**
     * Measure how many cm the robot drives in 1 second at 50 %, then enter it here.
     */
    //% blockId=youth_cal_drive block="calibrate drive: 1 sec at 50 \\% = %cm cm"
    //% cm.defl=20
    //% group="Setup" weight=92 advanced=true
    export function calibrateDrive(cm: number): void {
        cmPerSecAt50 = Math.max(1, cm)
    }

    //% blockId=youth_cal_dark block="it is dark when light level is below %level"
    //% level.defl=30 level.min=0 level.max=255
    //% group="Setup" weight=80 advanced=true
    export function setDarkLevel(level: number): void {
        darkLevel = level
    }

    //% blockId=youth_cal_avoid block="set obstacle sensor threshold %value"
    //% value.defl=800 value.min=0 value.max=1023
    //% group="Setup" weight=75 advanced=true
    export function setObstacleThreshold(value: number): void {
        avoidThreshold = value
    }
}
