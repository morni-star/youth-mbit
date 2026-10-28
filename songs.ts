/**
 * YOUTH Music — song and jingle data.
 * Notation (one string, notes separated by spaces):
 *   NOTE[#|b][octave][:length]   e.g.  "E5:2 D#5 E5 R:4 C4:8"
 *   R = rest. Octave and length carry over to the next note until changed.
 *   Length is in sixteenth notes: 1 = 1/16, 2 = 1/8, 4 = 1/4 (one beat), 8 = 1/2, 16 = whole.
 * Every song is a public-domain composition or a traditional tune, arranged here
 * as a short one-voice melody. Jingles are original YOUTH tunes.
 * Cartoon theme songs are not included because they are copyrighted —
 * teachers can type their own melodies with "play notes".
 */

enum YouthSong {
    //% block="Für Elise (Beethoven)"
    FurElise = 0,
    //% block="Ode to Joy (Beethoven)"
    OdeToJoy = 1,
    //% block="Canon in D (Pachelbel)"
    CanonInD = 2,
    //% block="Minuet in G (Petzold)"
    MinuetInG = 3,
    //% block="Turkish March (Mozart)"
    TurkishMarch = 4,
    //% block="Lullaby (Brahms)"
    Lullaby = 5,
    //% block="Morning Mood (Grieg)"
    MorningMood = 6,
    //% block="Mountain King (Grieg)"
    MountainKing = 7,
    //% block="Can-Can (Offenbach)"
    CanCan = 8,
    //% block="William Tell (Rossini)"
    WilliamTell = 9,
    //% block="Greensleeves (traditional)"
    Greensleeves = 11
}

enum YouthPartySong {
    //% block="Happy Birthday"
    HappyBirthday = 13,
    //% block="Jingle Bells"
    JingleBells = 14,
    //% block="We Wish You a Merry Christmas"
    MerryChristmas = 20,
    //% block="Silent Night"
    SilentNight = 21,
    //% block="Deck the Halls"
    DeckTheHalls = 22,
    //% block="Joy to the World"
    JoyToTheWorld = 23,
    //% block="Auld Lang Syne (New Year)"
    AuldLangSyne = 24,
    //% block="Bridal Chorus (wedding)"
    BridalChorus = 10,
    //% block="Westminster school bell"
    SchoolBell = 16
}

enum YouthKidsSong {
    //% block="Twinkle Twinkle Little Star"
    Twinkle = 12,
    //% block="Old MacDonald"
    OldMacDonald = 15,
    //% block="Row Row Row Your Boat"
    RowYourBoat = 30,
    //% block="Mary Had a Little Lamb"
    MaryLamb = 31,
    //% block="London Bridge"
    LondonBridge = 32,
    //% block="Brother John (Frère Jacques)"
    BrotherJohn = 33,
    //% block="Itsy Bitsy Spider"
    ItsyBitsy = 34,
    //% block="Baa Baa Black Sheep"
    BaaBaa = 35
}

enum YouthJingle {
    //% block="power on"
    PowerOn = 0,
    //% block="power off"
    PowerOff = 1,
    //% block="intro fanfare"
    Intro = 2,
    //% block="level up"
    LevelUp = 3,
    //% block="success"
    Success = 4,
    //% block="try again"
    TryAgain = 5,
    //% block="goal!"
    Goal = 6,
    //% block="victory"
    Victory = 7,
    //% block="game over"
    GameOver = 8,
    //% block="coin"
    Coin = 9,
    //% block="notification"
    Notification = 10,
    //% block="doorbell"
    Doorbell = 11,
    //% block="shop chime"
    ShopChime = 12,
    //% block="countdown 3-2-1-go"
    Countdown = 13,
    //% block="class start"
    ClassStart = 14,
    //% block="class end"
    ClassEnd = 15,
    //% block="cartoon chase"
    CartoonChase = 16,
    //% block="cartoon tiptoe"
    CartoonTiptoe = 17,
    //% block="magic sparkle"
    Magic = 18,
    //% block="surprise!"
    Surprise = 19
}

namespace youthMusic {
    export function _songData(id: number): string {
        switch (id) {
            // ---- classic ----
            case 0: return "E5:2 D#5 E5 D#5 E5 B4 D5 C5 A4:6 C4:2 E4 A4 B4:6 E4:2 G#4 B4 C5:6 E4:2 E5 D#5 E5 D#5 E5 B4 D5 C5 A4:6 C4:2 E4 A4 B4:6 E4:2 C5 B4 A4:8"
            case 1: return "E4:4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4:6 D4:2 D4:8 E4:4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4:6 C4:2 C4:8"
            case 2: return "F#5:8 E5 D5 C#5 B4 A4 B4 C#5 D5:4 C#5 B4 A4 G4 F#4 G4 E4 D4:2 F#4 A4 G4 F#4 D4 F#4 E4 D4 B3 D4 A4 G4 B4 A4 G4 F#4:8"
            case 3: return "D5:4 G4:2 A4 B4 C5 D5:4 G4 G4 E5:4 C5:2 D5 E5 F#5 G5:4 G4 G4 C5:4 D5:2 C5 B4 A4 B4:4 C5:2 B4 A4 G4 F#4:4 G4:2 A4 B4 G4 A4:12"
            case 4: return "B4:1 A4 G#4 A4 C5:4 D5:1 C5 B4 C5 E5:4 F5:1 E5 D#5 E5 B5 A5 G#5 A5 B5 A5 G#5 A5 C6:8 A5:2 C6 B5 A5 G5 A5 B5 A5 G5 A5 B5 A5 G5 F#5 E5:8"
            case 5: return "E4:2 E4 G4:8 E4:2 E4 G4:8 E4:2 G4 C5:4 B4:6 A4:2 A4:4 G4 D4:2 E4 F4:4 D4 D4:2 E4 F4:8 D4:2 F4 B4 A4 G4:4 B4 C5:8"
            case 6: return "G5:2 E5 D5 C5 D5 E5 G5 E5 D5 C5 D5:1 E5 D5 E5 G5:2 E5 G5 A5 E5 A5 G5 E5 D5 C5:8"
            case 7: return "A3:2 B3 C4 D4 E4 C4 E4:4 D#4:2 B3 D#4:4 D4:2 A#3 D4:4 A3:2 B3 C4 D4 E4 C4 E4 A4 G4 E4 C4 E4 G4:8"
            case 8: return "C4:4 D4:2 F4 E4 D4 G4:4 G4 G4:2 A4 E4 F4 D4:4 D4 D4:2 F4 E4 D4 C4 C5 B4 A4 G4 F4 E4 D4 C4:8"
            case 9: return "G4:1 G4 G4:2 G4:1 G4 G4:2 G4:1 G4 C5:2 D5 E5 G4:1 G4 G4:2 G4:1 G4 C5:2 E5 D5 B4 G4:4 G4:1 G4 G4:2 G4:1 G4 G4:2 G4:1 G4 C5:2 D5 E5 C5 E5 G5 C6:8"
            case 11: return "A4:2 C5:4 D5:2 E5:3 F5:1 E5:2 D5:4 B4:2 G4:3 A4:1 B4:2 C5:4 A4:2 A4:3 G#4:1 A4:2 B4:4 G#4:2 E4:4 R:2 A4:2 C5:4 D5:2 E5:3 F5:1 E5:2 D5:4 B4:2 G4:3 A4:1 B4:2 C5:3 B4:1 A4:2 G#4:3 F#4:1 G#4:2 A4:8"
            // ---- celebration ----
            case 10: return "C4:4 F4:3 F4:1 F4:8 C4:4 G4:3 E4:1 F4:8 C4:4 F4:3 A#4:1 A#4:4 A4:3 G4:1 F4:4 E4:3 F4:1 G4:8"
            case 13: return "G4:3 G4:1 A4:4 G4 C5 B4:8 G4:3 G4:1 A4:4 G4 D5 C5:8 G4:3 G4:1 G5:4 E5 C5 B4 A4:8 F5:3 F5:1 E5:4 C5 D5 C5:8"
            case 14: return "E4:4 E4 E4:8 E4:4 E4 E4:8 E4:4 G4 C4:6 D4:2 E4:16 F4:4 F4 F4:6 F4:2 F4:4 E4 E4 E4:2 E4 E4:4 D4 D4 E4 D4:8 G4:8"
            case 16: return "E4:8 C4 D4 G3:16 G3:8 D4 E4 C4:16 E4:8 D4 C4 G3:16 G3:8 D4 E4 C4:16"
            case 20: return "G4:4 C5 C5:2 D5 C5 B4 A4:4 A4 A4 D5 D5:2 E5 D5 C5 B4:4 G4 G4 E5 E5:2 F5 E5 D5 C5:4 A4 G4:2 G4 A4:4 D5 B4 C5:8"
            case 21: return "G4:6 A4:2 G4:4 E4:12 G4:6 A4:2 G4:4 E4:12 D5:8 D5:4 B4:12 C5:8 C5:4 G4:12 A4:8 A4:4 C5:6 B4:2 A4:4 G4:6 A4:2 G4:4 E4:12 A4:8 A4:4 C5:6 B4:2 A4:4 G4:6 A4:2 G4:4 E4:12 D5:8 D5:4 F5:6 D5:2 B4:4 C5:12 E5:12 C5:6 G4:2 E4:4 G4:6 F4:2 D4:4 C4:12"
            case 22: return "G4:6 F4:2 E4:4 D4 C4 D4 E4 C4 D4:2 E4 F4 D4 E4:6 D4:2 C4:4 B3 C4:8 G4:6 F4:2 E4:4 D4 C4 D4 E4 C4 D4:2 E4 F4 D4 E4:6 D4:2 C4:4 B3 C4:8"
            case 23: return "C5:8 B4:6 A4:2 G4:12 F4:4 E4:8 D4 C4:12 G4:4 A4:12 A4:4 B4:12 B4:4 C5:12"
            case 24: return "G4:4 C5:6 C5:2 C5:4 E5 D5:6 C5:2 D5:4 E5 C5:6 C5:2 E5:4 G5 A5:12 A5:4 G5:6 E5:2 E5:4 C5 D5:6 C5:2 D5:4 E5 C5:6 A4:2 A4:4 G4 C5:12"
            // ---- kids ----
            case 12: return "C4:4 C4 G4 G4 A4 A4 G4:8 F4:4 F4 E4 E4 D4 D4 C4:8 G4:4 G4 F4 F4 E4 E4 D4:8 G4:4 G4 F4 F4 E4 E4 D4:8 C4:4 C4 G4 G4 A4 A4 G4:8 F4:4 F4 E4 E4 D4 D4 C4:8"
            case 15: return "G4:4 G4 G4 D4 E4 E4 D4:8 B4:4 B4 A4 A4 G4:8 R:4 D4 G4 G4 G4 D4 E4 E4 D4:8 B4:4 B4 A4 A4 G4:12"
            case 30: return "C4:6 C4:6 C4:4 D4:2 E4:6 E4:4 D4:2 E4:4 F4:2 G4:12 C5:2 C5 C5 G4 G4 G4 E4 E4 E4 C4 C4 C4 G4:4 F4:2 E4:4 D4:2 C4:12"
            case 31: return "E4:4 D4 C4 D4 E4 E4 E4:8 D4:4 D4 D4:8 E4:4 G4 G4:8 E4:4 D4 C4 D4 E4 E4 E4 E4 D4 D4 E4 D4 C4:16"
            case 32: return "G4:6 A4:2 G4:4 F4 E4 F4 G4:8 D4:4 E4 F4:8 E4:4 F4 G4:8 G4:6 A4:2 G4:4 F4 E4 F4 G4:8 D4:8 G4 E4:4 C4:12"
            case 33: return "C4:4 D4 E4 C4 C4 D4 E4 C4 E4 F4 G4:8 E4:4 F4 G4:8 G4:2 A4 G4 F4 E4:4 C4 G4:2 A4 G4 F4 E4:4 C4 C4 G3 C4:8 C4:4 G3 C4:8"
            case 34: return "G4:2 C5:4 C5:2 C5:4 D5:2 E5:6 E5:4 E5:2 D5:4 C5:2 D5:4 E5:2 C5:12 E5:6 E5:4 F5:2 G5:6 G5:6 F5:4 E5:2 F5:4 G5:2 E5:12"
            case 35: return "C4:4 C4 G4 G4 A4:2 B4 C5 A4 G4:8 F4:4 F4 E4 E4 D4 D4 C4:8"
        }
        return ""
    }

    export function _jingleData(j: YouthJingle): string {
        switch (j) {
            case YouthJingle.PowerOn: return "C4:2 E4 G4 C5:6"
            case YouthJingle.PowerOff: return "C5:2 G4 E4 C4:6"
            case YouthJingle.Intro: return "G4:2 C5 E5 G5:4 E5:2 G5:8"
            case YouthJingle.LevelUp: return "C5:1 E5 G5 C6 E6 G6:4"
            case YouthJingle.Success: return "C5:2 E5 G5 C6:6"
            case YouthJingle.TryAgain: return "G4:2 E4 C4:6"
            case YouthJingle.Goal: return "C5:1 C5 C5 G5:4 R:1 E5:1 G5:8"
            case YouthJingle.Victory: return "G4:2 C5 E5 G5:4 E5:2 G5:4 C6:12"
            case YouthJingle.GameOver: return "G4:4 F#4 F4 E4:12"
            case YouthJingle.Coin: return "A5:1 E6:4"
            case YouthJingle.Notification: return "E6:1 R G6:2"
            case YouthJingle.Doorbell: return "E5:8 C5:12"
            case YouthJingle.ShopChime: return "G5:2 E5 C5 E5 G5 C6:6"
            case YouthJingle.Countdown: return "C5:4 R:4 C5:4 R:4 C5:4 R:4 C6:12"
            case YouthJingle.ClassStart: return "C5:2 D5 E5 G5 E5 G5 C6:8"
            case YouthJingle.ClassEnd: return "C6:2 G5 E5 C5 D5 E5 C5:8"
            case YouthJingle.CartoonChase: return "C5:1 D5 E5 F5 G5 F5 E5 D5 C5 D5 E5 F5 G5 A5 B5 C6:4"
            case YouthJingle.CartoonTiptoe: return "C4:2 R E4 R G4 R E4 R C4:2 R G3 R C4:4"
            case YouthJingle.Magic: return "C6:1 G5 E6 C6 G6 E6 C7:4"
            case YouthJingle.Surprise: return "C4:2 R:2 C6:8"
        }
        return ""
    }
}
