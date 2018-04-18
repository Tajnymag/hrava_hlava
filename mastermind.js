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

    nextGuess(last_guess, last_num_i, slot_i) {
        let new_guess = last_guess.slice(0);
        new_guess[slot_i] = this.set_arr()[last_num_i + 1];

        return new_guess;
    }
}

module.exports = Mastermind;