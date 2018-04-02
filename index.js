const PirateBay = require('thepiratebay')

PirateBay.search('silicon valley s01e01', {
  category: 0,
  orderBy: 'seeds',
  sortBy: 'desc'
})
.then(results => {
  console.log(results.length);
  console.log(results);
})
.catch(err => console.log(err))
