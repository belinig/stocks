using System;

namespace stocks.Data
{
    internal class WatchlistException : Exception
    {
        public WatchlistException()
        {
        }

        public WatchlistException(string message) : base(message)
        {
        }

        public WatchlistException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}