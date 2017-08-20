using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.ObjectModel;
using Jarloo.CardStock.Helpers;
using MongoDB.Bson;
using stocks.Helpers;
using stocks.Models;
using stocks.Data;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Net;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace stocks.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class QuoteApiController : Controller
    {
        public ObservableCollection<Quote> Quotes { get; set; }     

        // GET: api/valuesE:\Work\IBSOFT\mvc\StockQuote\src\StockQuote\Controllers\
        [HttpGet]
        //public IEnumerable<Quote> Get()
        //{
        //    Quotes = new ObservableCollection<Quote>();

        //    //Some example tickers
        //    Quotes.Add(new Quote("FAR.AX"));
        //    Quotes.Add(new Quote("MTS.AX"));
        //    YahooStockEngine.Fetch(Quotes);
        //    return Quotes.AsEnumerable<Quote>();
        //}

        public List<BsonDocument> Get()
        {
            Quotes = new ObservableCollection<Quote>();

            //Some example tickers
            Quotes.Add(new Quote("FAR.AX"));
            Quotes.Add(new Quote("MTS.AX"));
            YahooStockEngine.Fetch(Quotes);
            //return Quotes.AsEnumerable<Quote>();
            return stocks.Data.MongoDBDataAccess.Connect();
        }

        // GET api/values/5
        [Route("Watchlist/Current/{watchlistname}")]
        public IActionResult Watchlist(string watchlistname)
        {
            string name = User?.Identity.Name;
            var email = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;


            if (string.IsNullOrEmpty(watchlistname)) return new BadRequestResult();
            ObservableCollection<Quote> Quotes = new ObservableCollection<Quote>();

            Watchlist watchlist = stocks.Data.MongoDBDataAccess.Watchlist(name, watchlistname);
            if (watchlist == null)
                return new NoContentResult();
            //Some example tickers
            foreach (Stock ticker in watchlist.Symbols)
            {
                Quotes.Add(new Quote(ticker.ToString()));
            }
            YahooStockEngine.Fetch(Quotes);
            return new JsonResult(new WatchlistQuote() { Quotes = Quotes, Watchlist = watchlist });
        }

        // GET api/values/5
        [HttpDelete]
        [Route("Watchlist/Delete/{watchlistid}")]
        public IActionResult DeleteWatchlist(string watchlistid)
        {
            string name = User?.Identity.Name;
            var email = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;


            if (string.IsNullOrEmpty(watchlistid)) return new BadRequestResult();
            ObservableCollection<Quote> Quotes = new ObservableCollection<Quote>();

            bool result = stocks.Data.MongoDBDataAccess.DeleteWatchlist(name, watchlistid);
;
            return new JsonResult(result);
        }

        // GET api/values/5
        [Route("Watchlist/Historical/{watchlistname}/{date}")]
        public IActionResult WatchlistHistorical(string watchlistname, DateTime date)
        {
            string name = User?.Identity.Name;
            var email = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;


            if (string.IsNullOrEmpty(watchlistname)) return new BadRequestResult();
            ObservableCollection<Quote> Quotes = new ObservableCollection<Quote>();

            Watchlist watchlist = stocks.Data.MongoDBDataAccess.Watchlist(name, watchlistname);
            if (watchlist == null)
                return new NoContentResult();
            //Some example tickers
            foreach (Stock ticker in watchlist.Symbols)
            {
                Quotes.Add(new Quote(ticker.ToString()));
            }

            YahooStockEngine.FetchHistorical(Quotes, date);
            return new JsonResult(new WatchlistQuote() { Quotes = Quotes, Watchlist = watchlist });
        }

   

        // GET api/values/5
        [HttpPost, Route("Watchlist/Save")]
        public IActionResult SaveWatchlist([FromBody]Watchlist watchlist)
        {
            bool success;
            string name = User?.Identity.Name;
            var email = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;


            if (watchlist == null || string.IsNullOrEmpty(watchlist.Name) ) return new BadRequestResult();
            try
            {
                success = stocks.Data.MongoDBDataAccess.SaveWatchlist(null, name, watchlist);
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
            }

            return new JsonResult(success);
        }

        [HttpGet, Route("Watchlists/Get")]
        public IActionResult GetWatchlists()
        {
            string name = User?.Identity.Name;
            var email = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
            List<string> watchlists = stocks.Data.MongoDBDataAccess.GetWatchlists(null, name);

            return new JsonResult(watchlists);
        }

        // GET api/values/5
        [Route("ASXStocks")]
        public IActionResult ASXStocks()
        {
            List<ASXListedCompany> stocks = ASXStockEngine.Fetch();

            return new JsonResult(stocks);
        }

        [Route("ASXStocks/Find/{match}/{count}")]
        public IActionResult FindASXStocks(string match, int count)
        {
            List<ASXListedCompany> stocks = MongoDBDataAccess.FindCompaniesByCode(match, count);
            if (stocks == null || stocks.Count < count || count == 0)
            {
                (stocks??new List<ASXListedCompany>()).AddRange(MongoDBDataAccess.FindCompaniesByDescriptionLessCode(match, count == 0? count : count - stocks.Count) ?? new List<ASXListedCompany>());
            }

            return new JsonResult(stocks);
        }

        [Route("ASXStocks/UpdateCache")]
        public IActionResult ASXStocksCached()
        {
            DateTime? updatedDate = ASXStockEngine.GetLastCacheUpdateDate();
            Task.Run(() =>
             { ASXStockEngine.UpdateCache(); }
            );
            KeyValuePair<string, DateTime?> updatedRecord = new KeyValuePair<string, DateTime?>("Cache last update date", updatedDate);

            return new JsonResult(updatedRecord);
        }

        [Route("ASXStocks/LastUpdateDate")]
        public IActionResult LastUpdateDate()
        {
            DateTime? updatedDate = ASXStockEngine.GetLastCacheUpdateDate();
            return new JsonResult(updatedDate);
        }

        // GET api/values/5
        [Route("Quote/{ticker}")]
        public Quote Get(string ticker)
        {
            Quotes = new ObservableCollection<Quote>();

            //Some example tickers
            Quotes.Add(new Quote(ticker +".AX"));

            YahooStockEngine.Fetch(Quotes);
            return Quotes[0];
        }

        [HttpPost]
        public IActionResult SaveWatchlist()
        {
            return View("QuoteTabs");
        }
    }
}
