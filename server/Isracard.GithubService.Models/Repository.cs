using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Isracard.GithubService.Models
{
    public class Repository
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Owner Owner { get; set; }
    }
}
