## ZIP-Server

Simple NodeJS server that validates US ZIP code values.

### Usage
Supports a single argument:

`http://<server-url>/?XXXXX`

where XXXXX is a five digit code

### Notes
Returns the following formats:

* `image/png` : PNG file of red X or green check
* `application/json` : `{"zip" : "true|false"}`
* `text/plain` : true|false

