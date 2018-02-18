<%@ WebHandler Language="c#" Class="ZipCheck" %>

using System;
using System.Web;

using System.IO;
using System.Collections;
using System.Web.Caching;
using System.IO.Compression;

public class ZipCheck : IHttpHandler
{
    public void ProcessRequest(HttpContext ctx)
    {
        // load zip list, get arg and do lookup
        ArrayList list = LoadZipCodes(ctx, "zip-codes.txt");
        string lookup = (ctx.Request.Url.Query.Length > 0 ? ctx.Request.Url.Query.Substring(1) : string.Empty);
        bool valid = list.Contains(lookup);

        // set status code
        ctx.Response.StatusCode = (valid ? 200 : 404);
        
        // set representation type and body
        ctx.Response.ContentType = "image/png";
        ctx.Response.TransmitFile(string.Format("{0}.png", valid));

        // caching info
        ctx.Response.AddHeader("Cache-Control", "public,max-age=108000");
        
        // alps descriptor
        ctx.Response.AddHeader("Link","<http://amundsen.com/examples/zipcheck/zipcheck-alps.xml>; rel='profile';")

        // end connection
        ctx.Response.End();

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
    
    private ArrayList LoadZipCodes(HttpContext ctx, string datafile)
    {
        datafile = ctx.Server.MapPath(datafile);
        ArrayList list = (ArrayList)ctx.Cache.Get(datafile);

        if (list == null)
        {
            list = new ArrayList();
            using (TextReader tr = new StreamReader(datafile))
            {
                while (tr.Peek() != -1)
                {
                    list.Add(tr.ReadLine());
                }
            }
            
            ctx.Cache.Add(
                datafile,
                list,
                new CacheDependency(datafile),
                Cache.NoAbsoluteExpiration,
                Cache.NoSlidingExpiration,
                CacheItemPriority.Normal,
                null);
        }

        return list;
        
    }

    private void SetCompression(HttpContext ctx)
    {
        string accept = (ctx.Request.Headers["Accept-encoding"] != null ? ctx.Request.Headers["Accept-encoding"] : string.Empty);
        
        if (accept.Contains("gzip"))
        {
            ctx.Response.Filter = new GZipStream(ctx.Response.Filter, CompressionMode.Compress);
            ctx.Response.AppendHeader("Content-Encoding", "gzip");
            return;
        }
            
        if (accept.Contains("deflate"))
        {
            ctx.Response.Filter = new DeflateStream(ctx.Response.Filter, CompressionMode.Compress);
            ctx.Response.AppendHeader("Content-Encoding", "deflate");
            return;
        }

        // if no match found
        return;
    }
    
}

/**********************************
 * demo code pile
 **********************************/
//SetCompression(ctx);
        
// xml representation
//ctx.Response.ContentType = " text/xml";
//ctx.Response.Write(String.Format("<root><zipcode>{0}</zipcode><status>{1}</status></root>", lookup, valid));

// html representation
//ctx.Response.ContentType = " text/html";
//ctx.Response.Write(String.Format("<html><body><p>The zipcode <b>{0}</b> is <b style=\"color:{1};\">{2}</b></p></body></html>", lookup, (valid ? "green" : "red"), valid));

// text representation
//ctx.Response.ContentType = " text/plain";
//ctx.Response.Write(String.Format("The zipcode [{0}] is {1}", lookup, valid));

// caching info
//ctx.Response.AddHeader("Cache-Control", "public,max-age=108000");

 
