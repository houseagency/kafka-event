const Event = require('../src/event');
const expect = require('chai').expect;
const td = require('testdouble');
const kafka = require('../src/kafka');

describe('Unit:', () => {

	before(() => {
		kafka._old_producer = kafka.producer;
		kafka.producer = {
			init: td.function(),
			send: td.function()
		};
		td.when(kafka.producer.init()).thenResolve();
		td.when(kafka.producer.send(), { ignoreExtraArgs: true }).thenResolve();
	});

	describe('Event class', () => {

		it('has an empty object as properties, at creation', () => {
			let event = new Event();
			expect(event.properties).to.deep.equal({});
		});

		it('takes the first constructor argument as initial properties', () => {
			let event = new Event({ mytest: 'hey!' });
			expect(event.properties).to.deep.equal({ mytest: 'hey!' });
		});

		it('is in valid state at creation, if there is no validate fn', () => {
			let event = new Event();
			expect(event.state).to.equal('valid');
		});

		it('is in invalid state if .validate() fn throws', () => {
			let event = new Event();
			event.validate = () => { throw new Error('Not ok'); };
			expect(event.state).to.equal('invalid');
		});

		it('is in valid state if .validate() fn does not throw', () => {
			let event = new Event();
			event.validate = () => { };
			expect(event.state).to.equal('valid');
		});

		describe('send()', () => {

			it('set event in "sending" state', () => {
				let event = new Event();
				event.send();
				expect(event.state).to.equal('sending');
			});

		});

		describe('sending state', () => {

			it('does not update properties if we are in sending state', () => {
				let event = new Event({ test: 'first'});
				event.send();
				event.properties = { test: 'second' };
				expect(event.properties).to.deep.equal({ test: 'first' });
			});

		});

	});

	after(() => {
		kafka.producer = kafka._old_producer;
		delete kafka._old_producer;
	});

});
