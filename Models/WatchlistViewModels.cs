using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System;

namespace stocks.Models
{
    public class WatchlistViewModel
    {

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime Date { get; set; }

        public IEnumerable<Quote> Quotes { get; set; }

    }
}