const G = require('generatorics');

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

    }

    removeFromSet(numbers) {
        let removed = [];

        for (let i = 0; i < numbers.length; ++i) {
            if (this.set.has(numbers[i])) {
                this.set.delete(numbers[i]);
                removed.push(numbers[i]);
            }
        }

        return removed;
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
}

module.exports = Mastermind;