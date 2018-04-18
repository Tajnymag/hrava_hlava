const cli = require('pixl-cli');
const EtneteraAPI = require('./etn_api');
const Mastermind = require('./mastermind');

async function main() {
    const etn = new EtneteraAPI('tajnymag', 'tajnymag+hravahlava@gmail.com', 100);
    const mm = new Mastermind(100);

    await etn.start();

    cli.print('Throwing away numbers not included in the secret code...\n');
    cli.progress.start({
        max: 100,
        amount: 100,
        width: cli.width() - 27,
        catchInt: true,
        catchTerm: true,
        catchCrash: true,
        exitOnSig: true
    });
    for (let num of mm.set) {
        const guess = mm.singleNumberGuess(num);
        const res = await etn.guess(guess);

        //console.log(`Tested singleNumber: ${num} with blacks: ${res.black} and whites: ${res.white}`);

        mm.set_map.set(num, res.black);

        if (res.black === 0 && res.white === 0) {
            mm.removeFromSet([guess[0]]);
            cli.progress.update(100 - mm.set_arr().length);
        }
    }
    cli.progress.erase();
    cli.print('Cut the possible set of numbers down to ' + cli.bold.red(mm.set_arr().length) + '!\n\n');
    cli.print("We're now in phase 2 of 2: Testing possible combinations...\n");
    cli.progress.draw();

    let last_guess = mm.singleNumberGuess(mm.set_arr()[0]);
    let last_res = await etn.guess(last_guess);

    for (let i = 0; i < mm.slots; ++i) {
        let guess = last_guess;
        let res = last_res;
        let item = 0;

        while (true) {
            guess = mm.nextGuess(last_guess, (item++ % mm.set_arr().length) - 1, i);

            res = await etn.guess(guess);

            /**
             * console.log(`Tested: pos=${i} black=${res.black} number=${guess[i]} setsize=${mm.set_map.size}/${mm.set_arr().length}/${mm.set.size}`);
             console.log(JSON.stringify(guess));
             */

            if (res.black > last_res.black) {
                cli.progress.update(i);

                last_res = res;
                last_guess = guess;

                const tmp_key = guess[i];
                const tmp_val = mm.set_map.get(tmp_key);

                mm.set_map.set(tmp_key, tmp_val - 1);
                if (mm.set_map.get(tmp_key) <= 0) {
                    mm.removeFromSet([tmp_key]);
                }
                break;
            } else {
                last_res = res;
                last_guess = guess;
            }
        }

        if (last_res.black === mm.slots) {
            cli.progress.end();
            cli.print(cli.bold.green('DONE!!!\n'));
            break;
        }
    }
}

main();