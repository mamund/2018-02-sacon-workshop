## UUID Generator

Simple NodeJS server that returns UUIDs. These UUIDs are actually collected from _another_ service (https://uuidgenerator.net/api). That means this service has a dependency on another service.

### Usage
A simple GET returns a new UUID

`http://<server-url>/`


### Notes
Returns a plain string (`text/plain`) response:


* `200 OK` plus a valid UUID
* `400 Invalid` plus an empty body

