var mongoose = require('mongoose');

var AssetUser = function () {
    this.connection = undefined;
};

AssetUser.prototype.init = function () {

    var self = this;

    self.connection = mongoose.connection;
    //connect to server
    mongoose.connect(settings.database.host);
