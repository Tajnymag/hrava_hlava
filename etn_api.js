const axios = require('axios');

class EtneteraAPI {
    constructor(nickname, email, slots) {
        this.nickname = nickname;
        this.email = email;
        this.slots = slots;
        this.base_url = 'https://ikariera.etnetera.cz/veletrhy'
        this.gameId = null;
    }

    async start() {
        try {
            const response = await axios.post(this.base_url + '/start', {nickname: this.nickname, email: this.email, slots: this.slots});
            this.gameId = response.data.gameId;
        } catch (error) {
            console.error(error);
        }
    }

    async guess(guess) {
        if (!this.gameId) {
            throw 'Missing gameId!';
        }
        try {
            const response = await axios.post(this.base_url + '/guess', {gameId: this.gameId, guess: guess});
            return response.data.evaluation;
        } catch (error) {
            console.error(error);
        }
    }

    async ranking() {
        try {
            const response = await axios.get(this.base_url + '/ranking');
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = EtneteraAPI;