using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoffeeWebAPI.Entities;

public class Ordered
{
    public int OrderedId { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }
    public int ProductId { get; set; }
    public Product? Product { get; set; }
    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal TotalPrice => UnitPrice * Quantity;


}
