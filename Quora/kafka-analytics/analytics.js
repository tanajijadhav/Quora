let kafka = require('kafka-node');
let db = require('./core/commons/db');
let messageHandler = require('./core/services/messageHandler');
let Consumer = kafka.Consumer;
let Producer = kafka.Producer;
let client = new kafka.KafkaClient({kafkaHost: "18.219.248.52:9092,3.14.132.209:9092,18.219.36.100:9092"});
let log = require('./core/commons/logger');
broker = new Producer(client);
broker.on('ready', (e, r, t) => {
    log.info("Main Backend Connected to Kafka");
    let consumer = new Consumer(
        client,
        [{
            topic: 'api',
            partition: 0
        }, {
            topic: 'counts',
            partition: 0
        }], {
            autoCommit: true
        }
    );
    consumer.on('message', function (message) {
        var data = JSON.parse(message.value);
        messageHandler(data.type, data.payload).then((data) => {}).catch((err) => {
            log.error('Error Processing Kafka Request' + JSON.stringify(err));
        })


    });
});
// setTimeout(()=>{
//     messageHandler('signup', {
//         createdAt: Date.now()
//     }).then((data) => {
//         console.log(JSON.stringify(data||{}));
//     }).catch((err) => {
//         console.log(err);
        
//         log.error('Error Processing Kafka Request : ' + JSON.stringify(err));
//     })
// },2000)
