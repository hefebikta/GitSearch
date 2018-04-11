using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Mvc;
using System.Web.SessionState;
using Isracard.GithubService.Models;

namespace Isracard.GithubService.Api.Controllers
{
    // Declare our route prefix + session required
    [System.Web.Http.RoutePrefix("bookmark"), SessionState(SessionStateBehavior.Required)]
    public class BookmarkController : ApiController
    {
        // If no bookmarks, jsut initialize (possible threading issues, maybe locking needed?)
        public BookmarkController()
        {
            HttpSessionState session = HttpContext.Current.Session;
            List<Repository> repositories = (List<Repository>)session["RepositoryBookmarks"];
            if (repositories == null)
            {
                repositories = new List<Repository>();
                session["RepositoryBookmarks"] = repositories;
            }
        }

        // Get all bookmrarks
        [System.Web.Http.HttpGet, System.Web.Http.Route("", Name = "GetBookmarks"),ResponseType(typeof(IEnumerable<Repository>))]
        public IHttpActionResult Get()
        {
            HttpSessionState session = HttpContext.Current.Session;
            List<Repository> repositories =  (List<Repository>)session["RepositoryBookmarks"];
            return Ok(repositories);
        }

        // remove bookmrark, for future use from bookmark list page
        [System.Web.Http.HttpDelete, System.Web.Http.Route("", Name = "RemoveBookmark")]
        public IHttpActionResult Remove(int id)
        {
            HttpSessionState session = HttpContext.Current.Session;
            List<Repository> repositories = (List<Repository>)session["RepositoryBookmarks"];
            Repository repository = repositories.FirstOrDefault(r => r.Id == id);
            // If no such repository already bookmarked, return to client
            if(repository ==  null)
                return BadRequest($"{id} not exists");
            // Nice bug, just implememt hash method on model - or traverse by id !!!
            // Doing nothing, because this method is not really used
            repositories.Remove(repository);
            session["RepositoryBookmarks"] = repositories;
            return Ok();
        }

        // Add repository to bookmarks
        [System.Web.Http.HttpPost, System.Web.Http.Route("", Name = "AddBookmark")]
        public IHttpActionResult Add([FromBody]Repository repository)
        {
            HttpSessionState session = HttpContext.Current.Session;
            List<Repository> repositories = (List<Repository>)session["RepositoryBookmarks"];
            // If already bookmarked, return to client
            if (repositories.Any(r => r.Id == repository.Id))
                return BadRequest($"{repository.Id} already exists");
            repositories.Add(repository);
            session["RepositoryBookmarks"] = repositories;
            return Ok();
        }
    }
}
