/**
 * YOUTH Kit — blocks for plug-in modules on any micro:bit pin
 * (LED, RGB LED, sound sensor, IR obstacle sensor, ultrasonic, touch pad,
 * joystick, button, buzzer, fan, servo). Replaces mbit_Display, mbit_Sensor,
 * mbit_Input, mbit_Music and mbit_Motor from the Yahboom mbit extension.
 */

enum YouthOnOff {
    //% block="on"
    On = 1,
    //% block="off"
    Off = 0
}

enum YouthRgbType {
    //% block="common cathode"
    CommonCathode = 0,
    //% block="common anode"
    CommonAnode = 1
}

enum YouthStick {
    //% block="up"
    Up = 1,
    //% block="down"
    Down = 2,
    //% block="left"
    Left = 3,
    //% block="right"
    Right = 4,
    //% block="pressed"
    Pressed = 5,
    //% block="in the middle"
    Middle = 0
}

enum YouthAxis {
    //% block="x"
    X = 0,
    //% block="y"
    Y = 1
}

//% color="#0E8A7E" weight=96 icon="" block="YOUTH Kit"
//% groups='["LED", "RGB LED", "Sensors", "Ultrasonic", "Touch & Button", "Joystick", "Buzzer", "Motor & Servo"]'
namespace youthKit {

    // ---------- LED ----------

    //% blockId=youth_kit_led block="LED at %pin %state"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="LED" weight=100
    export function led(pin: DigitalPin, state: YouthOnOff): void {
        pins.digitalWritePin(pin, state)
    }

    //% blockId=youth_kit_led_level block="LED at %pin brightness %percent \\%"
    //% percent.defl=50 percent.min=0 percent.max=100
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="LED" weight=95
    export function ledBrightness(pin: AnalogPin, percent: number): void {
        pins.analogWritePin(pin, Math.constrain(percent, 0, 100) * 1023 / 100)
    }

    /**
     * Fade an LED up and down (breathing) a number of times.
     */
    //% blockId=youth_kit_breath block="breathing LED at %pin %times times || speed %ms ms"
    //% times.defl=1 ms.defl=1500
    //% expandableArgumentMode="toggle"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="LED" weight=90
    export function breathe(pin: AnalogPin, times: number, ms?: number): void {
        let total = ms ? ms : 1500
        let steps = 50
        for (let t = 0; t < times; t++) {
            for (let i = 0; i <= steps; i++) {
                pins.analogWritePin(pin, i * 1023 / steps)
                basic.pause(total / 2 / steps)
            }
            for (let i = steps; i >= 0; i--) {
                pins.analogWritePin(pin, i * 1023 / steps)
                basic.pause(total / 2 / steps)
            }
        }
    }

    // ---------- RGB LED module ----------
    let rgbType = YouthRgbType.CommonCathode

    //% blockId=youth_kit_rgb_type block="RGB LED module type %type"
    //% group="RGB LED" weight=80
    export function setRgbType(type: YouthRgbType): void {
        rgbType = type
    }

    function rgbWrite(pin: AnalogPin, v: number) {
        v = Math.constrain(v, 0, 255) * 1023 / 255
        pins.analogWritePin(pin, rgbType == YouthRgbType.CommonAnode ? 1023 - v : v)
    }

    //% blockId=youth_kit_rgb_color block="RGB LED R %r G %g B %b show %color"
    //% r.fieldEditor="gridpicker" g.fieldEditor="gridpicker" b.fieldEditor="gridpicker"
    //% color.fieldEditor="gridpicker" color.fieldOptions.columns=3
    //% inlineInputMode=inline
    //% group="RGB LED" weight=100
    export function rgbColor(r: AnalogPin, g: AnalogPin, b: AnalogPin, color: YouthColor): void {
        rgbValues(r, g, b, (color >> 16) & 0xFF, (color >> 8) & 0xFF, color & 0xFF)
    }

    //% blockId=youth_kit_rgb_values block="RGB LED R %r G %g B %b red %red green %green blue %blue"
    //% red.min=0 red.max=255 green.min=0 green.max=255 blue.min=0 blue.max=255
    //% inlineInputMode=inline
    //% group="RGB LED" weight=95
    export function rgbValues(r: AnalogPin, g: AnalogPin, b: AnalogPin, red: number, green: number, blue: number): void {
        rgbWrite(r, red)
        rgbWrite(g, green)
        rgbWrite(b, blue)
    }

    // ---------- Sensors ----------

    /**
     * True while the sound sensor hears a loud sound (module pulls the pin low).
     */
    //% blockId=youth_kit_sound block="sound sensor at %pin hears sound?"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Sensors" weight=100
    export function hearsSound(pin: DigitalPin): boolean {
        pins.setPull(pin, PinPullMode.PullUp)
        return pins.digitalReadPin(pin) == 0
    }

    //% blockId=youth_kit_on_sound block="when sound sensor at %pin hears a sound"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Sensors" weight=98
    export function onSound(pin: DigitalPin, handler: () => void): void {
        watchPin(pin, handler)
    }

    /**
     * True when the IR obstacle sensor module sees something in front.
     */
    //% blockId=youth_kit_ir_obstacle block="IR obstacle sensor at %pin sees obstacle?"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Sensors" weight=95
    export function irObstacle(pin: DigitalPin): boolean {
        pins.setPull(pin, PinPullMode.PullUp)
        return pins.digitalReadPin(pin) == 0
    }

    /**
     * Send a short 38 kHz infrared burst from an IR LED on the chosen pin.
     */
    //% blockId=youth_kit_ir_send block="send IR burst from %pin"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Sensors" weight=90
    export function irBurst(pin: DigitalPin): void {
        for (let i = 0; i < 8; i++) {
            pins.digitalWritePin(pin, 1)
            control.waitMicros(13)
            pins.digitalWritePin(pin, 0)
            control.waitMicros(13)
        }
    }

    /**
     * Read any analog module (light, soil, potentiometer…) as 0–100 %.
     */
    //% blockId=youth_kit_analog block="analog sensor at %pin (\\%)"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Sensors" weight=85
    export function analogPercent(pin: AnalogPin): number {
        return Math.round(pins.analogReadPin(pin) * 100 / 1023)
    }

    // ---------- Ultrasonic module ----------

    /**
     * Distance from an ultrasonic module on any pins (cm, 0–400; 400 = nothing).
     */
    //% blockId=youth_kit_sonar block="ultrasonic trig %trig echo %echo distance (cm)"
    //% trig.fieldEditor="gridpicker" trig.fieldOptions.columns=4
    //% echo.fieldEditor="gridpicker" echo.fieldOptions.columns=4
    //% group="Ultrasonic" weight=100
    export function ultrasonic(trig: DigitalPin, echo: DigitalPin): number {
        let reads: number[] = []
        for (let i = 0; i < 3; i++) {
            pins.setPull(trig, PinPullMode.PullNone)
            pins.digitalWritePin(trig, 0)
            control.waitMicros(2)
            pins.digitalWritePin(trig, 1)
            control.waitMicros(10)
            pins.digitalWritePin(trig, 0)
            let d = pins.pulseIn(echo, PulseValue.High, 25000)
            reads.push(d == 0 ? 400 : Math.min(400, d / 58))
            basic.pause(10)
        }
        reads.sort((a, b) => a - b)
        return Math.round(reads[1])
    }

    // ---------- Touch & Button ----------

    /**
     * True while the touch pad is touched. Some pads give HIGH when touched — use "touch pad gives".
     */
    //% blockId=youth_kit_touch block="touch pad at %pin is touched?"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Touch & Button" weight=100
    export function touched(pin: DigitalPin): boolean {
        pins.setPull(pin, PinPullMode.PullUp)
        return pins.digitalReadPin(pin) == touchLevel
    }
    let touchLevel = 1

    //% blockId=youth_kit_touch_level block="touch pad gives %level when touched"
    //% level.min=0 level.max=1 level.defl=1
    //% group="Touch & Button" weight=80 advanced=true
    export function setTouchLevel(level: number): void {
        touchLevel = level ? 1 : 0
    }

    //% blockId=youth_kit_button block="button module at %pin is pressed?"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Touch & Button" weight=95
    export function buttonPressed(pin: DigitalPin): boolean {
        pins.setPull(pin, PinPullMode.PullUp)
        return pins.digitalReadPin(pin) == 0
    }

    //% blockId=youth_kit_on_button block="when button module at %pin is pressed"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Touch & Button" weight=90
    export function onButton(pin: DigitalPin, handler: () => void): void {
        watchPin(pin, handler)
    }

    // fires once on each HIGH→LOW change (pull-up modules)
    function watchPin(pin: DigitalPin, handler: () => void) {
        pins.setPull(pin, PinPullMode.PullUp)
        control.inBackground(function () {
            let was = pins.digitalReadPin(pin)
            while (true) {
                let now = pins.digitalReadPin(pin)
                if (was == 1 && now == 0) handler()
                was = now
                basic.pause(20)
            }
        })
    }

    // ---------- Joystick ----------

    //% blockId=youth_kit_stick_is block="joystick X %x Y %y SW %sw is %dir"
    //% x.fieldEditor="gridpicker" y.fieldEditor="gridpicker" sw.fieldEditor="gridpicker"
    //% inlineInputMode=inline
    //% group="Joystick" weight=100
    export function joystickIs(x: AnalogPin, y: AnalogPin, sw: DigitalPin, dir: YouthStick): boolean {
        return joystickDirection(x, y, sw) == dir
    }

    function joystickDirection(x: AnalogPin, y: AnalogPin, sw: DigitalPin): YouthStick {
        pins.setPull(sw, PinPullMode.PullUp)
        if (pins.digitalReadPin(sw) == 0) return YouthStick.Pressed
        let vx = pins.analogReadPin(x)
        let vy = pins.analogReadPin(y)
        if (vx < 200) return YouthStick.Up
        if (vx > 800) return YouthStick.Down
        if (vy < 200) return YouthStick.Right
        if (vy > 800) return YouthStick.Left
        return YouthStick.Middle
    }

    /**
     * Joystick position from -100 to 100 (0 = middle).
     */
    //% blockId=youth_kit_stick_value block="joystick %axis value at %pin"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Joystick" weight=95
    export function joystickValue(axis: YouthAxis, pin: AnalogPin): number {
        return Math.round(Math.map(pins.analogReadPin(pin), 0, 1023, -100, 100))
    }

    // ---------- Buzzer ----------

    /**
     * For an active buzzer module: switch it on or off.
     */
    //% blockId=youth_kit_buzzer block="buzzer module at %pin %state"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Buzzer" weight=100
    export function buzzer(pin: DigitalPin, state: YouthOnOff): void {
        pins.setPull(pin, PinPullMode.PullNone)
        pins.digitalWritePin(pin, state)
    }

    //% blockId=youth_kit_buzzer_beep block="buzzer module at %pin beep %times times"
    //% times.defl=2
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Buzzer" weight=95
    export function buzzerBeep(pin: DigitalPin, times: number): void {
        for (let i = 0; i < times; i++) {
            pins.digitalWritePin(pin, 1)
            basic.pause(150)
            pins.digitalWritePin(pin, 0)
            basic.pause(150)
        }
    }

    // ---------- Motor & Servo ----------

    //% blockId=youth_kit_fan block="fan at %pin speed %percent \\%"
    //% percent.defl=50 percent.min=0 percent.max=100
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Motor & Servo" weight=100
    export function fan(pin: AnalogPin, percent: number): void {
        pins.analogWritePin(pin, Math.constrain(percent, 0, 100) * 1023 / 100)
    }

    //% blockId=youth_kit_servo block="servo at %pin to %angle °"
    //% angle.defl=90 angle.min=0 angle.max=180
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Motor & Servo" weight=95
    export function servo(pin: AnalogPin, angle: number): void {
        pins.servoWritePin(pin, Math.constrain(angle, 0, 180))
    }
}
