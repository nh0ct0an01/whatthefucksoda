var mongoClient = require('mongodb').MongoClient;
mongoClient.connect('mongodb://127.0.0.1:27017/nodedb', function (err, db) {
    if (err) throw err;
    console.log('Tao thanh cong database');
    db.close();
});