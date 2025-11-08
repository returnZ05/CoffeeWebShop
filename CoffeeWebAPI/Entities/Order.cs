using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;     


namespace CoffeeWebAPI.Entities;

public class Order
{
    public int OrderId { get; set; }
    
    public int UserId { get; set; }
    public User? User { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.Now;
    public required string Status { get; set; } = "Pending";
    public List<Ordered>? Items { get; set; }
}
