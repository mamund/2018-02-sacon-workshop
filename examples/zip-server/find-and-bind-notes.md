## Find And Bind Notes

These notes outline the planned functionality of the `findAndBind` method of the `discovery.js` NodeJS module.

## Description
Find and Bind is a single action that allows services to interact with a DISCO registry all in one step;

Sample call:

`discovery.findAndBind(serviceIdentity,servicesNeeded,callback)`

where:

 * `serviceIdentity` is your service's `serviceName` and `serviceURL`
 * `servicesNeeded` is a collection of filters (one for each dependent service you wish to use)
 * `callback` is a function to execute after the `findAndBind` work is completed


