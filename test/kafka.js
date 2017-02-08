const expect = require('chai').expect;
const td = require('testdouble');

const kafka = require('../src/kafka');

describe('Unit:', () => {

	describe('kafka', () => {

		describe('send()', () => {

			before(() => {
				kafka._old_producer = kafka.producer;
				kafka.producer = {
					init: td.function(),
					send: td.function()
				};
				td.when(kafka.producer.init()).thenResolve();
				td.when(kafka.producer.send(), { ignoreExtraArgs: true }).thenResolve();
			});

			it('will run send() on the producer with our event data', () => {
				return kafka.send({ test: 'hey!' })
				.then(() => {
					td.verify(kafka.producer.send({
						topic: 'events',
						partition: 0,
						message: {
							value: JSON.stringify({ test: 'hey!' })
						}
					}));
				});
			});

			after(() => {
				kafka.producer = kafka._old_producer;
				delete kafka._old_producer;
			});

		});

	});

});
