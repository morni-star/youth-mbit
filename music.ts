/**
 * YOUTH Music — songs, jingles, sound effects and "sound from data".
 * Works on micro:bit V1 and V2 (uses tones only, no V2-only sound expressions).
 */

enum YouthPlayMode {
    //% block="until done"
    UntilDone = 0,
    //% block="in background"
    Background = 1,
    //% block="looping in background"
    Loop = 2
}

enum YouthSfx {
    //% block="ambulance siren"
    Ambulance = 0,
    //% block="police siren"
    Police = 1,
    //% block="fire alarm"
    Alarm = 2,
    //% block="car horn"
    Horn = 3,
    //% block="reverse beep"
    Reverse = 4,
    //% block="laser"
    Laser = 5,
    //% block="rocket launch"
    Rocket = 6,
    //% block="robot talk"
    RobotTalk = 7,
    //% block="heartbeat"
    Heartbeat = 8,
    //% block="engine start"
    Engine = 9,
    //% block="bounce"
    Bounce = 10,
    //% block="falling"
    Falling = 11
}

enum YouthScale {
    //% block="major"
    Major = 0,
    //% block="minor"
    Minor = 1,
    //% block="pentatonic"
    Pentatonic = 2
}

//% color="#7B3FBF" weight=98 icon="" block="YOUTH Music"
//% groups='["Songs", "Jingles", "Sound Effects", "My Melody", "Sound from Data", "Settings"]'
namespace youthMusic {
    let tempoBpm = 120
    let generation = 0
    let playing = false
    let transpose = 0

    // ---------- player ----------
    const NOTE_INDEX = [9, 11, 0, 2, 4, 5, 7] // A B C D E F G → semitone in octave

    function noteFreq(midi: number): number {
        return Math.round(440 * Math.pow(2, (midi - 69) / 12))
    }

    /**
     * Plays a melody written in YOUTH notation. Returns false if it was stopped.
     */
    function playNotation(melody: string, myGen: number): boolean {
        let sixteenthMs = Math.idiv(60000, tempoBpm) >> 2
        let octave = 4
        let length = 4
        let tokens = melody.split(" ")
        for (let t = 0; t < tokens.length; t++) {
            if (myGen != generation) return false
            let tok = tokens[t]
            if (tok.length == 0) continue
            let c = tok.charAt(0)
            let i = 1
            let semis = 0
            let rest = c == "R" || c == "r" || c == "-"
            if (!rest) {
                let idx = "ABCDEFGabcdefg".indexOf(c) % 7
                if ("ABCDEFGabcdefg".indexOf(c) < 0) continue
                semis = NOTE_INDEX[idx]
                if (i < tok.length && tok.charAt(i) == "#") { semis++; i++ }
                else if (i < tok.length && tok.charAt(i) == "b") { semis--; i++ }
            }
            let colon = tok.indexOf(":")
            let octText = colon >= 0 ? tok.substr(i, colon - i) : tok.substr(i)
            if (!rest && octText.length > 0) octave = parseInt(octText)
            if (colon >= 0) length = Math.max(1, parseInt(tok.substr(colon + 1)))
            let ms = length * sixteenthMs
            if (rest) {
                basic.pause(ms)
            } else {
                let midi = (octave + 1) * 12 + semis + transpose
                music.playTone(noteFreq(midi), ms * 9 / 10)
                basic.pause(ms / 10)
            }
        }
        return true
    }

    function run(melody: string, mode: YouthPlayMode) {
        generation++
        let myGen = generation
        if (mode == YouthPlayMode.UntilDone) {
            playing = true
            playNotation(melody, myGen)
            if (myGen == generation) playing = false
        } else {
            control.inBackground(function () {
                playing = true
                let keep = true
                while (keep) {
                    let finished = playNotation(melody, myGen)
                    keep = finished && mode == YouthPlayMode.Loop && myGen == generation
                }
                if (myGen == generation) playing = false
            })
        }
    }

    // ---------- Songs ----------

    /**
     * Play a classical piece.
     */
    //% blockId=youth_play_song block="play classic %song %mode"
    //% song.fieldEditor="gridpicker" song.fieldOptions.columns=2
    //% group="Songs" weight=100
    export function playSong(song: YouthSong, mode: YouthPlayMode): void {
        run(_songData(song), mode)
    }

    /**
     * Play a song for birthdays, Christmas, New Year, weddings or school.
     */
    //% blockId=youth_play_party block="play celebration %song %mode"
    //% song.fieldEditor="gridpicker" song.fieldOptions.columns=2
    //% group="Songs" weight=98
    export function playPartySong(song: YouthPartySong, mode: YouthPlayMode): void {
        run(_songData(song), mode)
    }

    /**
     * Play a children's song.
     */
    //% blockId=youth_play_kids block="play kids song %song %mode"
    //% song.fieldEditor="gridpicker" song.fieldOptions.columns=2
    //% group="Songs" weight=96
    export function playKidsSong(song: YouthKidsSong, mode: YouthPlayMode): void {
        run(_songData(song), mode)
    }

    //% blockId=youth_play_jingle block="play jingle %jingle %mode"
    //% jingle.fieldEditor="gridpicker" jingle.fieldOptions.columns=3
    //% group="Jingles" weight=100
    export function playJingle(jingle: YouthJingle, mode: YouthPlayMode): void {
        run(_jingleData(jingle), mode)
    }

    //% blockId=youth_stop_music block="stop music"
    //% group="Songs" weight=90
    export function stopMusic(): void {
        generation++
        playing = false
        music.stopAllSounds()
    }

    //% blockId=youth_is_playing block="music is playing?"
    //% group="Songs" weight=85
    export function isPlaying(): boolean {
        return playing
    }

    // ---------- Sound effects ----------

    function sweep(from: number, to: number, ms: number) {
        let steps = 20
        for (let i = 0; i <= steps; i++) {
            music.playTone(from + (to - from) * i / steps, ms / steps)
        }
    }

    /**
     * Play a sound effect and wait until it finishes.
     */
    //% blockId=youth_sfx block="play sound effect %fx"
    //% fx.fieldEditor="gridpicker" fx.fieldOptions.columns=3
    //% group="Sound Effects" weight=100
    export function playEffect(fx: YouthSfx): void {
        switch (fx) {
            case YouthSfx.Ambulance:
                for (let i = 0; i < 4; i++) { music.playTone(880, 400); music.playTone(659, 400) }
                break
            case YouthSfx.Police:
                for (let i = 0; i < 3; i++) { sweep(600, 1400, 350); sweep(1400, 600, 350) }
                break
            case YouthSfx.Alarm:
                for (let i = 0; i < 8; i++) { music.playTone(1047, 120); basic.pause(60) }
                break
            case YouthSfx.Horn:
                music.playTone(415, 250); basic.pause(80); music.playTone(415, 450)
                break
            case YouthSfx.Reverse:
                for (let i = 0; i < 4; i++) { music.playTone(1000, 200); basic.pause(300) }
                break
            case YouthSfx.Laser:
                sweep(2000, 300, 300)
                break
            case YouthSfx.Rocket:
                sweep(200, 2500, 1500)
                break
            case YouthSfx.RobotTalk:
                for (let i = 0; i < 10; i++) music.playTone(randint(300, 1200), 70)
                break
            case YouthSfx.Heartbeat:
                for (let i = 0; i < 3; i++) { music.playTone(110, 80); basic.pause(100); music.playTone(98, 120); basic.pause(500) }
                break
            case YouthSfx.Engine:
                sweep(80, 160, 600); sweep(160, 120, 400); sweep(120, 220, 600)
                break
            case YouthSfx.Bounce:
                sweep(400, 900, 120); sweep(900, 400, 120)
                break
            case YouthSfx.Falling:
                sweep(1500, 150, 1200)
                break
        }
    }

    /**
     * Glide smoothly from one pitch to another.
     */
    //% blockId=youth_glide block="glide from %from Hz to %to Hz in %ms ms"
    //% from.defl=262 to.defl=1047 ms.defl=500
    //% group="Sound Effects" weight=90
    export function glide(from: number, to: number, ms: number): void {
        sweep(from, to, ms)
    }

    //% blockId=youth_beep block="beep %times times"
    //% times.defl=1 times.min=1 times.max=20
    //% group="Sound Effects" weight=85
    export function beep(times: number): void {
        for (let i = 0; i < times; i++) {
            music.playTone(988, 120)
            basic.pause(80)
        }
    }

    // ---------- My Melody ----------

    /**
     * Play your own melody, e.g. "C4:4 D E F G:8". Octave and length carry over.
     * Length: 1 = 1/16, 2 = 1/8, 4 = 1 beat, 8 = 2 beats. R = rest.
     */
    //% blockId=youth_play_notes block="play notes %melody %mode"
    //% melody.defl="C4:4 D4 E4 F4 G4:8"
    //% group="My Melody" weight=100
    export function playNotes(melody: string, mode: YouthPlayMode): void {
        run(melody, mode)
    }

    /**
     * Play a melody made in the MakeCode melody editor (8 notes).
     */
    //% blockId=youth_play_editor block="play melody %melody %mode"
    //% melody.shadow="melody_editor"
    //% group="My Melody" weight=95
    export function playEditorMelody(melody: string, mode: YouthPlayMode): void {
        // editor notes are one beat each; "C5" marks the high C
        let parts = melody.split(" ")
        let out = ""
        for (let p = 0; p < parts.length; p++) {
            let n = parts[p]
            if (n.length == 0) continue
            if (n == "-") out += "R:4 "
            else if (n.length == 1) out += n + "4:4 "
            else out += n + ":4 "
        }
        run(out, mode)
    }

    // ---------- Sound from Data ----------

    /**
     * Turn any number into a pitch: low value = low note, high value = high note.
     * Great for parking sensors, light meters and data sonification.
     */
    //% blockId=youth_value_tone block="play %value from %low to %high as tone for %ms ms"
    //% low.defl=0 high.defl=100 ms.defl=200
    //% group="Sound from Data" weight=100
    export function playValue(value: number, low: number, high: number, ms: number): void {
        let v = Math.constrain(value, Math.min(low, high), Math.max(low, high))
        let f = Math.map(v, low, high, 131, 1047)
        music.playTone(f, ms)
    }

    /**
     * Turn a number into a note of a musical scale, so data sounds like music.
     */
    //% blockId=youth_value_note block="play %value from %low to %high on %scale scale for %ms ms"
    //% low.defl=0 high.defl=100 ms.defl=250
    //% group="Sound from Data" weight=95
    export function playValueOnScale(value: number, low: number, high: number, scale: YouthScale, ms: number): void {
        let steps = scale == YouthScale.Major ? [0, 2, 4, 5, 7, 9, 11]
            : scale == YouthScale.Minor ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 7, 9]
        let total = steps.length * 2 + 1
        let v = Math.constrain(value, Math.min(low, high), Math.max(low, high))
        let k = Math.round(Math.map(v, low, high, 0, total - 1))
        let midi = 60 + Math.idiv(k, steps.length) * 12 + steps[k % steps.length]
        music.playTone(noteFreq(midi + transpose), ms)
    }

    /**
     * Beep faster as the value gets smaller — like a car's reverse parking sensor.
     */
    //% blockId=youth_proximity_beep block="proximity beep for %value from near %near to far %far"
    //% near.defl=5 far.defl=50
    //% group="Sound from Data" weight=90
    export function proximityBeep(value: number, near: number, far: number): void {
        if (value <= near) {
            music.playTone(1047, 400)
            return
        }
        if (value >= far) return
        let gap = Math.map(value, near, far, 40, 600)
        music.playTone(1047, 80)
        basic.pause(gap)
    }

    // ---------- Settings ----------

    //% blockId=youth_set_tempo block="set music tempo to %bpm bpm"
    //% bpm.defl=120 bpm.min=40 bpm.max=300
    //% group="Settings" weight=100
    export function setTempo(bpm: number): void {
        tempoBpm = Math.constrain(bpm, 40, 300)
    }

    /**
     * Move every song up or down by semitones (12 = one octave).
     */
    //% blockId=youth_transpose block="transpose music by %semitones semitones"
    //% semitones.defl=0 semitones.min=-24 semitones.max=24
    //% group="Settings" weight=95
    export function setTranspose(semitones: number): void {
        transpose = semitones
    }

    //% blockId=youth_set_volume block="set volume to %percent \\%"
    //% percent.defl=50 percent.min=0 percent.max=100
    //% group="Settings" weight=90
    export function setVolume(percent: number): void {
        music.setVolume(Math.constrain(percent, 0, 100) * 255 / 100)
    }
}
