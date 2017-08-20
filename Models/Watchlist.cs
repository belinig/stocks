﻿using System;
using System.ComponentModel;
using MongoDB.Bson;
using System.Collections.Generic;
using Newtonsoft.Json;
using stocks.Helpers.Json;

namespace stocks.Models
{
    public class Watchlist
    {
        [JsonConverter(typeof(ObjectIdConverter))]
        public ObjectId Id { get; set; }
        [JsonIgnore]
        public ObjectId UserId { get; set; }
        public string Name { get; set; }
        public List<Stock> Symbols { get; set; }
        [JsonIgnore]
        [MongoDB.Bson.Serialization.Attributes.BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime? CreatedDate { get; set; }
        [JsonIgnore]
        [MongoDB.Bson.Serialization.Attributes.BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime? LastAccessDate { get; set; }
    }

}