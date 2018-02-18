## ZIPCheck (C#/ASP.NET)

**ZIPCheck** is a small service that validates US Zip Code values.

### Service and Client
 * A live instance of the service is running here: http://amundsen.com/examples/zipcheck/zipcheck.ashx
 * An HTML Client (w/ pointers to source code can be found here: http://amundsen.com/examples/zipcheck/

### Using the ZIPCheck Service
To use this service you simply send a query string that looks like this:

`http://amundsen.com/examples/zipcheck/zipcheck.ashx?{zipcode}`

where

`{zipcode}` contains one or more digits.

The service returns either:
 
 * `200 OK` and a green check-mark image ![true.png](true.png)
 * `404 Not Found` and a red X image ![false.png](false.png)
 
Valid (`200 OK`) responses contain a caching header good for three hours:

* `Cache-Control : "public,max-age=108000"`

NOTE: ZIPCheck is a read-only service and only supports HTTP GET calls.

