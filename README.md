# kafka-event

This is a JavaScipt (nodejs) module for the events when doing CQRS and Event
Sourcing with Apache Kafka streams.

## How to use

### 1. Create an event class with custom validation code:

```javascript
const Event = require('kafka-event');

class AddTodoEvent extends Event {

	validate() {
		if (typeof this.properties.description !== 'string') {
			throw new Error('Description must be a string.');
		}
	}

}
```

### 2. Instantiate, set your properties, and send to Apache Kafka!

```javascript
let addTodo = new AddTodoEvent();
addTodo.properties = { description: 'Eat apple pie' };
addTodo.send();
```

### 3. Violà!

However, there are some more things you might want to look in to...

## Tests

### Unit tests

Run the unit tests:

    npm test

### Integration tests

Requires docker-compose version 1.10.0 or later, and docker (only tested with
docker version 1.12.1).

Run the interation tests:

    npm run integrationtests

## Functions/metods

### .send([<optional topic>])

This function will send the event to Apache Kafka.

You can specify a topic, or the `KAFKAEVENT_TOPIC` environment variable will
be used. If `KAFKAEVENT_TOPIC` is not set, the default topic is `events`.

The `.send()` function has a Promise interface, which will resolve when the
event's state goes to `sent`, or reject when the state goes to `failed`.

## Event states

The `.state` property contains the current state of the event.

```javascript
console.log(addTodo.state); // 'invalid', 'valid', 'sending', 'sent', 'failed'
```

### `invalid` state

The event does not validate.

The `.lastErr` property contains the last thrown error from your custom
`.validate()` function.

If there is no custom `.validate()` function, then the event can never be in
this state.

From this state, we can only go to the `valid` state, by updating the
properties to something that passes the `.validate()` function.

### `valid` state

The event is valid and can be sent to Apache Kafka using the `.send()` method.

If there is no custom `.validate()` function, a newly created event will
start in this state.

From this state, we can go to those states:

* `invalid`, if the properties are updated to something that does not pass
  the custom `.validate()` function.
* `sending`, if the `.send()` function is called.

### `sending` state

We are in the process of sending this to Apache Kafka.

We enter this state by calling the `.send()` function.

From this state, we can go to those states:

* `sent` - if Apache Kafka successfully received the event.
* `failed` - if Apache Kafka did not successfully receive the event.

### `sent` state

The event was successfully sent to Apache Kafka.

From here, it is impossible to go to any other state.

### `failed` state

We were not able to send this to Apache Kafka.

From here, it is impossible to go to any other state.

## Kafka configuration

### Environment variables

* `KAFKA_URL` - Comma delimited list of initial brokers list.
* `KAFKA_CLIENT_CERT` and `KAFKA_CLIENT_CERT_KEY` for SSL cert and key.
* `KAFKAEVENT_TOPIC` - To what topic we are sending events.
  Default is `events`. This can be overridden for individual events by the
  options object passed to the `.send()` function.
   Default is `127.0.0.1:9092`.
* `KAFKAEVENT_ACKS` - How many acks to wait for, until an event is successfully 
  sent. `0` or negative number means waiting until all in sync Kafka replicas
  has acked. We do not support not waiting (because that is supid). Note that
  we will never wait for more acks than there are in-sync replicas.
  Default: `2`
* `KAFKAEVENT_TIMEOUT` - Timeout in milliseconds for produce request.
  Default is 10000.
* `KAFKAEVENT_CLIENTID` - The client identifier.
  Default is a random string generated for each node process.
* `KAFKAEVENT_RECONN_DELAY` - progressive delay between reconnection attempts
  in milliseconds. Default is 1000.
* `KAFKAEVENT_RECONN_MAX_DELAY` - max delay between reconnection attempts, in
  milliseconds. Default is 5000.
* `KAFKAEVENT_RETRIES` - Max number of attempts to send the message.
  Default is `5`.
* `KAFKAEVENT_RETRIES_DELAY` - The delay is progressive and incrememented at
  each attempt. Default is 1000.
* `KAFKAEVENT_RETRIES_MAX_DELAY` - Maximum delay value. Default is `5000`.

## Promises

The `.send()` function has a Promise interface, which will resolve when the
state goes to `sent`, or reject when the state goes to `failed`.

```javascript
addTodo.send()
.then(() => {
	// Yay!
})
```

## Considerations

* When doing Event Sourcing, order is important! That is why we will only send
  your event to Kafka partition 0. So, you should only create one partition
  in Kafka, since we will only use that one.
