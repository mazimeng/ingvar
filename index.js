const api = require('./api');

api.getAllEpisodes(1)
  .then(rows => {
    console.log(rows);
  });
