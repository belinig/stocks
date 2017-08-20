using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using stocks.SPA.Models;

namespace stocks.SPA.Controllers
{
    public class AppUtils
    {
        internal static IActionResult SignIn(ApplicationUser user, IList<string> roles)
        {
            var userResult = new { User = new { DisplayName = user.UserName, Roles = roles } };
            return new ObjectResult(userResult);
        }
    }
}