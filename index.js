const os = require('os');
const EtneteraAPI = require('./etn_api');
const Mastermind = require('./mastermind');

const check_pins = (white, black,guess, mm) => {
    if (black === 100) {
        console.log('DONE!!');
        os.exit();
    } else if (black === 0 && white === 0) {
        console.log('Removed: ' + mm.removeFromSet(guess));
        return false;
    }
};

async function main() {
    const etn = new EtneteraAPI('tajnymag', 'tajnymag+hravahlava@gmail.com', 100);
    const mm = new Mastermind(100);
    let attempt = 0;

    await etn.start();

    let done = false;

    for (let num of mm.set) {
        const guess = mm.singleNumberGuess(num);
        const res = await etn.guess(guess);
        console.log('Tested singleNumber: ' + num);
        check_pins(res.white, res.black, guess, mm);
        attempt++;
    }

    while (!done) {
        const possible_guesses = mm.allPossible();
        let last_guess = [];
        let last_res = {};

        for (let guess of possible_guesses) {
            if (last_guess !== [] && last_res !== {} && !mm.sameResult(last_guess, guess, last_res.white, last_res.black)) {
                continue;
            }

            const res = await etn.guess(guess);
            last_guess = guess;
            last_res = { white: res.white, black: res.black };

            console.log('Tested: ' + guess);
            console.log(res.white, res.black);

            done = check_pins(res.white, res.black, guess, mm);
        }
    }
}

main();