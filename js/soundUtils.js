const SoundUtils = (() => {
    let audioContext = null;

    async function prepare() {
        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) {
            return null;
        }

        if (!audioContext) {
            audioContext =
                new AudioContextClass();
        }

        if (
            audioContext.state ===
            "suspended"
        ) {
            await audioContext.resume();
        }

        return audioContext;
    }

    function playNote({
        frequency,
        delay = 0,
        duration = 0.15,
        volume = 0.05,
        type = "triangle"
    }) {
        if (
            !audioContext ||
            audioContext.state !==
                "running"
        ) {
            return;
        }

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        const startTime =
            audioContext.currentTime +
            delay;

        oscillator.type = type;

        oscillator.frequency.setValueAtTime(
            frequency,
            startTime
        );

        gain.gain.setValueAtTime(
            volume,
            startTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            startTime + duration
        );

        oscillator.connect(gain);
        gain.connect(
            audioContext.destination
        );

        oscillator.start(startTime);
        oscillator.stop(
            startTime + duration
        );
    }

    function playGood(
        strength = "normal"
    ) {
        const notes =
            strength === "big"
                ? [
                    [523.25, 0, 0.16],
                    [659.25, 0.10, 0.16],
                    [783.99, 0.20, 0.18],
                    [1046.50, 0.31, 0.38]
                ]
                : [
                    [659.25, 0, 0.14],
                    [783.99, 0.11, 0.22]
                ];

        notes.forEach(
            ([
                frequency,
                delay,
                duration
            ]) => {
                playNote({
                    frequency,
                    delay,
                    duration,
                    volume:
                        strength === "big"
                            ? 0.06
                            : 0.045,
                    type: "triangle"
                });
            }
        );
    }

    function playBad() {
        const notes = [
            [293.66, 0, 0.20],
            [220, 0.14, 0.22],
            [164.81, 0.29, 0.28],
            [110, 0.47, 0.48]
        ];

        notes.forEach(
            ([
                frequency,
                delay,
                duration
            ]) => {
                playNote({
                    frequency,
                    delay,
                    duration,
                    volume: 0.045,
                    type: "sawtooth"
                });
            }
        );
    }

    function playCountdown(
        secondsRemaining
    ) {
        const countdownFrequencies = {
            3: 440,
            2: 554.37,
            1: 659.25
        };

        const frequency =
            countdownFrequencies[
                secondsRemaining
            ];

        if (!frequency) {
            return;
        }

        playNote({
            frequency,
            duration: 0.16,
            volume: 0.055,
            type: "sine"
        });
    }

    function playTimerTick({
        secondsRemaining,
        totalSeconds = 30
    }) {
        const safeSeconds =
            Math.max(
                0,
                Math.min(
                    secondsRemaining,
                    totalSeconds
                )
            );

        const progress =
            (
                totalSeconds -
                safeSeconds
            ) /
            totalSeconds;

        const baseFrequency =
            260 + progress * 360;

        const frequency =
            safeSeconds % 2 === 0
                ? baseFrequency
                : baseFrequency * 1.18;

        playNote({
            frequency,
            duration: 0.055,
            volume: 0.028,
            type: "sine"
        });
    }

    function playTimeUp() {
        const notes = [
            [783.99, 0, 0.20],
            [880, 0.18, 0.20],
            [1046.50, 0.36, 0.42]
        ];

        notes.forEach(
            ([
                frequency,
                delay,
                duration
            ]) => {
                playNote({
                    frequency,
                    delay,
                    duration,
                    volume: 0.065,
                    type: "triangle"
                });
            }
        );
    }

    return {
        prepare,
        playGood,
        playBad,
        playCountdown,
        playTimerTick,
        playTimeUp
    };
})();