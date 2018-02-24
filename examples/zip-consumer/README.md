ZIP-Consumer
Simple NodeJS server that validates US ZIP code values.

### Usage:
Supports a single argument:

`http://<server-url>/?XXXXX`

where XXXXX is a five digit code

Returns the following formats:
* text/plain : true|false

### Notes
Set as a "pass-through" client that depends on another service (`zip-server`) to actually to the work.

Use this as an API Middleware client.
