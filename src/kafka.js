const config = require('./config');
const Kafka = require('no-kafka');

const producerConfig = {
	requiredAcks: config.acks < 1 ? -1 : config.acks,
	timeout: config.timeout,
	clientId: config.clientId,
	reconnectionDelay: {
		min: config.reconnDelay,
		max: config.reconnMaxDelay
	},
	retries: {
		attempts: config.retries,
		delay: {
			min: config.retriesDelay,
			max: config.retriesMaxDelay
		}
	},
	codec: Kafka.COMPRESSION_NONE,
	batch: {
		size: 0,
		maxWait: 0
	},
	asyncCompression: false
};

const kafka = {

	producer: new Kafka.Producer(producerConfig),

	init: () => {
		if (this._init) return this._init;
		kafka._init = kafka.producer.init();
		return kafka._init;
	},

	send: (data, options) => {
		return kafka.init().then(() => {
			let topic = config.topic;
			if (options && options.topic) topic = options.topic;
			return kafka.producer.send({
				topic: topic,
				partition: 0,
				message: {
					value: JSON.stringify(data)
				}
			});
		});
	}

}

module.exports = kafka;
