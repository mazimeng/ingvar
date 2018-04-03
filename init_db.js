var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('ingvar.db');

db.serialize(function() {
  db.run("CREATE TABLE episodes (id text, name TEXT)");
  db.run("create unique index idx_e_name on episodes (name)");
  db.run("create unique index idx_id_name on episodes (id)");
  db.run(`CREATE TABLE torrents (
    seeders integer,
    leechers integer,
    size float,
    verified integer,
    magnet_link text,
    choice float,
    episode_id text)`);
});

db.close();
