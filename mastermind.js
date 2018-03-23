const G = require('generatorics');
const os = require('os');

function range(from, to) {
    let range_arr = [];

    for (let i = from; i <= to; ++i) {
        range_arr.push(i);
    }

    return range_arr;
}

class Mastermind {
    constructor(slots) {
        this.set = new Set(range(1,slots));
        this.slots = slots;
        this.set_arr = () => Array.from(this.set_map.keys());
        this.set_map = new Map();
    }

    generateMap(slots) {
        let tmp = new Map();
        for (let i = 0; i < slots; ++i) {
            tmp[i + 1] = 1;
        }
        return tmp;
    }

    removeFromSet(numbers) {
        let removed = [];

        for (let i = 0; i < numbers.length; ++i) {
            this.set.delete(numbers[i]);
            this.set_map.delete(numbers[i]);
            removed.push(numbers[i]);
        }

        return [...new Set(removed)];
    }

    singleNumberGuess(num) {
        let tmp = [];

        for (let i = 0; i < this.slots; ++i) {
            tmp.push(num);
        }

        return tmp;
    }

    allPossible() {
        return G.baseN(Array.from(this.set), this.slots);
    }

    sameResult(guess, pos_answer, white, black) {
        let tmp_black = 0;
        let tmp_white = 0;

        for (let i = 0; i < this.slots; ++i) {
            if (tmp_black > black || tmp_white > white) {
                return false;
            }

            if (guess[i] === pos_answer[i]) {
                tmp_black += 1;
            } else if (pos_answer.includes(guess[i])) {
                tmp_white += 1;
            }
        }

        return (tmp_black === black && tmp_white === white)

    }

    nextGuess(last_guess, last_num_i, slot_i) {
        let new_guess = last_guess.slice(0);
        new_guess[slot_i] = this.set_arr()[last_num_i + 1];

        return new_guess;
    }

    checkPins(black, white, guess) {
        if (black === 100) {
            console.log('DONE!!');
            os.exit();
        } else if (black === 0 && white === 0) {
            console.log('Removed: ' + this.removeFromSet([guess[0]]));
            return false;
        }
    }
}

module.exports = Mastermind;