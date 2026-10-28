# YOUTH mBit

A full MakeCode block pack for the **Yahboom m:bit Smart Robot Car**, plug-in sensor modules and music. Made for the YOUTH Computer Tachileik Robotics course (Level 1–8, age 7–14).

It replaces every block in `lzty634158/yahboom_mbit_en` (v3.0.5) with clearer, safer blocks and adds 50+ new ones. Works on micro:bit V1 and V2.

## Add it to MakeCode

1. Open https://makecode.microbit.org → New Project
2. Extensions → paste this repository's GitHub URL → add **youth-mbit**

Three categories appear: **YOUTH Car**, **YOUTH Kit** and **YOUTH Music**.

## YOUTH Car — the robot car

| Group | Blocks |
| --- | --- |
| Move | drive forward at 50 % for 1 sec · drive forward at 50 % · turn right 90° · spin left at 50 % · curve left at 50 % for 1 sec · stop · set wheels left % right % |
| Smart Moves | drive forward 30 cm · drive forward until closer than 15 cm · follow the line at 40 % · follow the line for 5 sec · follow the line to the next station · drive a shape with 4 sides of 30 cm |
| Lights | headlight [color] · headlight red/green/blue · underglow lights [color] · underglow light 1 [color] · underglow rainbow · underglow brightness % · turn signal left blink 3 times · emergency lights for 3 sec · car sound [horn / reverse beep / sirens / engine] · all lights off |
| Sensors | distance (cm) · obstacle in front? · left line sensor sees black · both sensors on the line / line on the left / line on the right / line lost · it is dark? |
| Events | when something is closer than 20 cm · when line lost (any line state) · when obstacle appears in front · when it gets dark |
| Servo | servo S1 to 90° · servo S1 sweep from 0° to 180° · gate on S1 open / close |
| Setup (more…) | calibrate distance × 1 · calibrate 90° turn · calibrate drive (cm per sec) · line threshold · obstacle threshold · dark level · raw line value |

## YOUTH Kit — plug-in modules on any pin

| Group | Blocks |
| --- | --- |
| LED | LED at pin on/off · LED brightness % · breathing LED N times |
| RGB LED | RGB LED show [color] · RGB LED red/green/blue · module type (common cathode / anode) |
| Sensors | sound sensor hears sound? · when sound sensor hears a sound · IR obstacle sensor sees obstacle? · send IR burst · analog sensor (%) |
| Ultrasonic | ultrasonic trig / echo distance (cm) |
| Touch & Button | touch pad is touched? · button module is pressed? · when button module is pressed · touch pad level |
| Joystick | joystick is up/down/left/right/pressed/middle · joystick x/y value (−100…100) |
| Buzzer | buzzer module on/off · buzzer beep N times |
| Motor & Servo | fan speed % · servo at pin to angle |

## YOUTH Music — songs, jingles, effects

| Group | Blocks |
| --- | --- |
| Songs | play classic [19] · play celebration [9] · play kids song [8] — until done / in background / looping · stop music · music is playing? |
| Jingles | play jingle [20 jingles: power on/off, intro, level up, success, try again, goal!, victory, game over, coin, notification, doorbell, shop chime, countdown, class start/end, cartoon chase, cartoon tiptoe, magic sparkle, surprise!] |
| Sound Effects | play sound effect [ambulance, police, fire alarm, car horn, reverse beep, laser, rocket, robot talk, heartbeat, engine, bounce, falling] · glide from Hz to Hz · beep N times |
| My Melody | play notes "C4:4 D E F G:8" · play melody (melody editor) |
| Sound from Data | play value as tone · play value on a major / minor / pentatonic scale · proximity beep (parking sensor) |
| Settings | tempo · transpose · volume |

Songs are public-domain compositions or traditional tunes, arranged as one-voice melodies:

- **Classic** — Für Elise, Ode to Joy, Canon in D, Minuet in G, Turkish March, Brahms Lullaby, Morning Mood, In the Hall of the Mountain King, Can-Can, William Tell, Greensleeves, Moonlight Sonata (3rd mvt), Symphony No. 5, Pathétique Rondo, La Campanella, Nocturne Op. 9 No. 2, Summer: Presto, Flight of the Bumblebee, Lacrimosa
- **Celebration** — Happy Birthday, Jingle Bells, We Wish You a Merry Christmas, Silent Night, Deck the Halls, Joy to the World, Auld Lang Syne, Bridal Chorus, Westminster school bell
- **Kids** — Twinkle Twinkle, Old MacDonald, Row Row Row Your Boat, Mary Had a Little Lamb, London Bridge, Brother John, Itsy Bitsy Spider, Baa Baa Black Sheep

Cartoon theme songs are copyrighted, so they are not built in. Type your own with **play notes**. Jingles are original.

### Writing your own notes

`NOTE[#|b][octave][:length]`, separated by spaces. `R` is a rest. Octave and length carry over. Length is in sixteenths: 1 = 1/16, 2 = 1/8, 4 = 1 beat, 8 = 2 beats, 16 = 4 beats.

```
E5:2 D#5 E5 D#5 E5 B4 D5 C5 A4:6
```

## Every original block, replaced

| Yahboom mbit block | YOUTH mBit block(s) | What changed |
| --- | --- | --- |
| CarCtrl, CarCtrlSpeed | drive …, drive … for … sec, spin, curve, stop | Speed in %, time built in, clear names |
| CarCtrlSpeed2 | set wheels left % right % | −100…100 per wheel, backward allowed |
| RGB_Car_Big2 / RGB_Car_Big | headlight [color] / headlight R G B | — |
| RGB_Car_Program (+ neopixel blocks) | underglow lights, underglow light N, rainbow, brightness | No extra neopixel blocks needed |
| ultrasonic return distance(cm) | distance (cm) | 58 µs/cm, numeric median of 5, 400 = nothing |
| Music_Car | play song / jingle / sound effect, car sound | Waits until done (or background), stoppable |
| Servo_Car | servo S1 to °, sweep, gate open/close | — |
| Avoid_Sensor | obstacle in front?, when obstacle appears | No debug serial output, adjustable threshold |
| Line_Sensor | left line sensor sees black, line position, when line … | Adjustable threshold, line position in one block |
| LED1 / LED2 / BreathLED | LED on/off, LED brightness %, breathing LED | Breathing is repeatable with adjustable speed |
| RGB / RGB2 | RGB LED red/green/blue, RGB LED show [color] | Common-anode modules supported |
| Voice_Sensor | sound sensor hears sound?, when … hears a sound | Event version added |
| IR_Sensor | IR obstacle sensor sees obstacle? | — |
| IR_Send | send IR burst from pin | Uses the chosen pin (original always used P9) |
| Ultrasonic (Trig/Echo) | ultrasonic trig echo distance | Median of 3, 400 = nothing |
| TouchPad | touch pad is touched? | Level adjustable |
| Rocker | joystick is …, joystick x/y value | Direction + value blocks |
| Button | button module is pressed?, when … pressed | Event version added |
| Buzzer | buzzer module on/off, beep N times | — |
| Fan | fan speed % | 0–100 % instead of 0–1023 |
| Servo | servo at pin to ° | — |

The built-in Yahboom melody list (dadadum, nyan, ba ding…) is still available from MakeCode's own **Music** category.

## Hardware map (from Yahboom mbit v3.0.5)

PCA9685 at 0x41 — headlight R/G/B ch0–2, servo S1–S3 ch3–5, left motor ch12/13, right motor ch15/14 · Ultrasonic Trig P14 / Echo P15 · Line Left P2 / Right P1 · IR avoid P3 (enable P9) · NeoPixel ×3 on P16.

## License

MIT
