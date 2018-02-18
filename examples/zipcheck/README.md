## ZIPCheck (C#/ASP.NET)

**ZIPCheck** is a small service that validates US Zip Code values.

### Service and Client
 * A live instance of the service is running here: http://amundsen.com/examples/zipcheck/zipcheck.ashx
 * An HTML Client (w/ pointers to source code) can be found here: http://amundsen.com/examples/zipcheck/

### Using the ZIPCheck Service
To use this service you simply send a query string that looks like this:

`http://amundsen.com/examples/zipcheck/zipcheck.ashx?{zipcode}`

where

`{zipcode}` contains one or more digits.

The service returns either:
 
 * `200 OK` and a green check image ![true.png](true.png)
 * `404 Not Found` and a red X image ![false.png](false.png)

### Example Usage
  * http://amundsen.com/examples/zipcheck/zipcheck.ashx?90210 returns ![true.png](true.png)
  * http://amundsen.com/examples/zipcheck/zipcheck.ashx?9021X returns ![false.png](false.png)

### Notes
 * Valid (`200 OK`) responses contain a caching header good for three hours: (`Cache-Control : "public,max-age=108000"`)
 * ZIPCheck is a read-only service and only supports HTTP GET calls.

