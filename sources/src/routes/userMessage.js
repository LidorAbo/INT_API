import { Router } from 'express';
const router = Router();

const mongoose = require('mongoose');
let winston = require('winston');

let logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'app.log'}),
    ]
});

const MessageSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    }
});


const Message = module.exports = mongoose.model('Messages', MessageSchema);

router.post('', (req, res, next) => {
    let newMessage = new Message({
        userId: req.body.userId,
        msg: req.body.msg
    });

    console.log(newMessage);
    Message.addMessage(newMessage, function (err, callback) {
        if (err) {
            console.log(callback);
            res.json({success: false, msg: 'failed to add message to db'});
        } else {
            console.log("message added to db successfully");
            logger.log('info', "New message added to DB! UserID: " + newMessage.userId + " ,Message: " + newMessage.msg);
            res.json({success: true, msg: 'message added to db successfully'});
        }
    });
});

module.exports.addMessage = function(newMessage, callback){
    newMessage.save(callback);
}
// export default router;
module.exports = router;