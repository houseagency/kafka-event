function randomClientId() {
	const randStr = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
	return 'instance-' + randStr;
}

const config = {
	acks: parseInt(process.env.KAFKAEVENT_ACKS) || 2,
	clientId: process.env.KAFKAEVENT_CLIENTID || randomClientId(),
	reconnDelay: parseInt(process.env.KAFKAEVENT_RECONN_DELAY) || 1000,
	reconnMaxDelay: parseInt(process.env.KAFKAEVENT_RECONN_MAX_DELAY) || 5000,
	retries: parseInt(process.env.KAFKAEVENT_RETRIES) || 50,
	retriesDelay: parseInt(process.env.KAFKAEVENT_RETRIES_DELAY) || 1000,
	retriesMaxDelay: parseInt(process.env.KAFKAEVENT_RETRIES_MAX_DELAY) || 5000,
	timeout: parseInt(process.env.KAFKAEVENT_TIMEOUT) || 10000,
	topic: process.env.KAFKAEVENT_TOPIC || 'events'
}

module.exports = config;
