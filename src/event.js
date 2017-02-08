const config = require('./config');
const kafka = require('./kafka');
const uuid = require('uuid/v4');

class Event {

	constructor(initialProperties) {
		this.type = this.constructor.name;
		this._sending = false;
		if (initialProperties) {
			this.properties = initialProperties;
		} else {
			this.properties = {};
		}
	}

	// ----- -- - ---- -----   - - -  --    -    -              -
	//  GETTERS AND SETTERS:
	// --- ----- - ------ ----  --   -   --   -     --   -

	get properties() {
		return this._properties;
	}

	set properties(val) {
		if (this.state === 'invalid' || this.state === 'valid') {
			this._properties = JSON.parse(JSON.stringify(val));
		}
	}

	get state() {
		if (this._sending) {
			return 'sending';
		}

		if (typeof this.validate === 'function') {
			try {
				this.validate();
			} catch (err) {
				this.lastErr = err;
				return 'invalid';
			}
		}

		return 'valid';
	}

	set state(val) {
		// Naah'...
	}

	// -------- -- - -- - ---  --  - ---   -    ---  - -    -     -
	// FUNCTIONS/METHODS:
	// ------ - -------- --  -  ---    -    -   -- -    --  -  -  -

	now() {
		return (new Date()).getTime();
	}

	send() {
		this._sending = true;
		const id = uuid();
		return kafka.send({
			id: id,
			time: this.now(),
			type: this.type,
			props: this.properties
		});
	}

}

module.exports = Event;
