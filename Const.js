/**
 * Created by slinker on 8/31/16.
 *
 */
var _ = require("lodash");
/* Config global variable for application
 * */
var Const = {
    // For config file.
    "loggerName": "BTC"
};
/*
 *  Config Schema for mongodb database
 * */
var ConstSchema = {
    User: {
        username: String,
        fullName: String,
        email: String,
        password: String,
        country: String,
        level: Number,
        Balance_ABC: Double,
        Balance_ETH: Double,
        Balance_BTC: Double,
        BTCAdress: String,
        ETHAdress: String,
        ABCAdress: String,
        createAt: {
            type: Date,
            default: Date.now
        },
        Historysend: {
            id: String,
            ToAddress: String,
            SendDate: Date,
            RateABC: Double,
        }
        Historysend: {
            id: String,
            FromAddress: String,
            SendDate: Date,
            RateABC: Double,
        }
        isAdmin: {
            type: Boolean,
            default: false
        },
        token: String,
        id: String
    },
    Token: {
        id: String,
        userID: String,
        token: String
    },
    MarkerHistory: {
        id: String,
        idUsersend: String,
        idUserreceive: String,
  },
   
  Admin: {
        id: String,
        admin_name: String,
        admin_mail: String,
        admin_phone: String,
        admin_country: String,
        

  }
  
};
/*
 * Defined error code
 * */
var ErrCode = {
    'EM0000': {
        code: 'EM0000',
        message: 'Database has problem'
    },
   
    'EM0001': {
        code: 'EM0002',
        message: 'Have err in saving database'
    },
    'EM0002': {
        code: 'EM0003',
        message: 'User is exist'
    },
    'EM0003': {
        code: 'EM0004',
        message: 'Can not genera token'
    },
    'EM0004': {
        code: 'EM0005',
        message: 'User not registered please register first'
    },
    'EM0005': {
        code: 'EM0006',
        message: 'Password or username wrong'
    },
    'EM0006': {
        code: 'EM0008',
        message: 'Have err in update database'
    },
    'EM0007': {
        code: 'EM0009',
        message: 'You has not permission!'
    },
    'EM009': {
        code: 'EM0010',
        message: 'User ID do not exist!'
    },
    'EM0010': {
        code: 'EM0011',
        message: 'Can not get all data info'
    },
    'EM0011': {
        code: 'EM0012',
        message: 'Update data error'
    },
    'EM0012': {
        code: 'EM0013',
        message: 'Have err in refresh token'
    },
    
   
    'EM0013': {
        code: 'EM0023',
        message: 'updateData false format json!'
    },
   
    'EM0014': {
        code: 'EM0029',
        message: 'parse spec from json object to string error'
    },
    'EM0015': {
        code: 'EM0030',
        message: 'spec in updateData false format array!'
    },
  
    'EM0016':{
        code:'EM0036',
        message:'page is small than 0'
    },
    'EM0017':{
        code:'EM0037',
        message:'qty in store can not < 0'
    },
   
    'EM0018': {
        code: 'EM0040',
        message: 'Add user to database error'
    },
    
};

/**
 *
 * @type {{SK_CONTROL_DEVICE: string}}
 */
var SocketName = {
    // User socket
    SK_USER_RECEIVE: 'usersendid',
    SK_USER_SEND: 'userreceiveid',
    //WEB socket
    SK_WEBSITE_SEND: 'sendabc',
    SK_WEBSITE_RECEIVE: 'receiveabc',
    SK_WEBSITE_SEND_ERROR: 'SendErr',
    SK_WEBSITE_RECEIVE_ERRORLL:'ReceiveErr',
    SK_WEBSITE_ADD_HISTORY:'Addtradehistory',
};

exports.Const = new _.assign({}, Const);
exports.ConstSchema = new _.assign({}, ConstSchema);
exports.ErrCode = new _.assign({}, ErrCode);
exports.SocketName = new _.assign({}, SocketName);

Listpeople:Array,




