const PirateBay = require('thepiratebay')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('ingvar.db');
const data = require('./torrents');
const uuidv4 = require('uuid/v4');

const api = {
  transform(results) {
    let regex = /[+-]?\d+(\.\d+)?/g;

    let torrents = results.map(val => {
      let sizeStr = val['size'];

      let size = parseFloat(sizeStr.match(regex)[0]);
      if (sizeStr.indexOf('GiB') >= 0) {
        size = size * 1024.0;
      }
      let seeders = parseInt(val.seeders);
      let leechers = parseInt(val.leechers);

      return {
        seeders,
        leechers,
        size,
        verified: val['verified'],
        magnetLink: val['magnetLink']
      }
    });

    return torrents;
  },
  gen(episodeName) {
    // return PirateBay.search(episodeName, {
    //     category: 0,
    //     orderBy: 'seeds',
    //     sortBy: 'desc'
    //   });
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  },
  addEpisode(id, name) {
    db.serialize(() => {
      db.run("insert into episodes (id, name) values(?, ?)", id, name, () => {
        console.log('addEpisode done', name);
      });
    });
  },
  addTorrent(episodeId, torrent) {
    db.serialize(() => {
      db.run(`insert into torrents (seeders, leechers, size, verified, magnet_link, choice, episode_id) values(?, ?, ?, ?, ?, ?)`,
        torrent.seeders,
        torrent.leechers,
        torrent.size,
        torrent.verified ? 1 : 0,
        torrent.magnetLink,
        0.0,
        episodeId,
        () => {
          console.log('addTorrent done');
        });
    });
  },
  retrieveEpisode(show, onSuccess) {
    const self = this;
    let {
      name,
      season,
      num_episodes
    } = show;

    let pad = function(num, digits) {
      var s = String(num);
      while (s.length < (digits || 2)) {
        s = "0" + s;
      }
      return s;
    }

    for (let i = 1; i <= num_episodes; ++i) {
      let episodeName = `${name} s${pad(season, 2)}e${pad(i, 2)}`;

      self.countEpisode(episodeName)
        .then(count => {
          if (count > 0) {} else {
            const episodeId = uuidv4();
            self.addEpisode(episodeId, episodeName);

            console.log('retrieving', episodeName);
            PirateBay.search(episodeName, {
              category: 0,
              orderBy: 'seeds',
              sortBy: 'desc'
            }).then(results => {
              let transformed = api.transform(results);
              if (onSuccess) onSuccess(episodeId, transformed);
            }).catch(err => {
              console.log(`failed to retrieve episode '${episodeName}'`, err);
            });
          }
        });
    }
  },
  countEpisode(name) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.get(`select count(*) as episode_count from episodes where name = ?`, name, (err, row) => {
          if(err) {
            reject(err);
          } else {
            resolve(row.episode_count);
          }
        });
      });
    });
  },
  pickTorrent(torrentId) {

  },
  getAllEpisodes() {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(`select * from episodes`, (err, rows) => {
          if(err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    });
  },
  getAllTorrents(episodeId) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(`select * from torrents where episode_id = ?`, episodeId, (err, rows) => {
          if(err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    });
  }
};

module.exports = api;
