using System;
using CoffeeWebAPI.Data;
using CoffeeWebAPI.Dtos;
using CoffeeWebAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace CoffeeWebAPI.Services;

public class OrderService: IOrderService
{
    private readonly CoffeeShopContext _context;

    public OrderService(CoffeeShopContext context)
    {
        _context = context;
    }


    public async Task<OrderDto> CheckoutAsync(int userId, CheckoutDto checkoutDto)
    {

        var cart = await _context.Orders
            .Include(o => o.Items)
                .ThenInclude(item => item.Product)
            .FirstOrDefaultAsync(o => o.UserId == userId && o.Status == "Pending");

        if (cart == null || !cart.Items.Any())
        {
            throw new Exception("A kosár üres, nincs mit megrendelni.");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {

            foreach (var item in cart.Items)
            {

                if (item.Product.Quantity < item.Quantity)
                {

                    throw new Exception($"Nincs elég készleten a termékből: {item.Product.Name}. Elérhető: {item.Product.Quantity} db.");
                }

                item.Product.Quantity -= item.Quantity;
            }
            cart.ShippingMethod = checkoutDto.ShippingMethod;
            cart.PaymentMethod = checkoutDto.PaymentMethod;
            cart.ShippingAddress = checkoutDto.ShippingAddress;

            cart.Status = "Completed";
            cart.OrderDate = DateTime.Now;

            await _context.SaveChangesAsync();
            
            await transaction.CommitAsync();
            
            return MapOrderToDto(cart);
        }
        catch (Exception)
        {

            await transaction.RollbackAsync();
            throw;
        }
    }



    private OrderDto MapOrderToDto(Order order)
    {
        return new OrderDto
        {
            OrderId = order.OrderId,
            UserId = order.UserId,
            OrderDate = order.OrderDate,
            Items = order.Items.Select(item => new OrderedDto
            {
                OrderedId = item.OrderedId,
                ProductId = item.ProductId,
                Name = item.Product.Name,
                Price = item.Product.Price,
                Image = item.Product.Image,
                Quantity = item.Quantity
            }).ToList()
        };
    }
    
    public async Task<IEnumerable<OrderDto>> GetMyOrdersAsync(int userId)
{

    var orders = await _context.Orders
        .Include(o => o.Items)
            .ThenInclude(item => item.Product)
        .Where(o => o.UserId == userId && o.Status != "Pending")
        .OrderByDescending(o => o.OrderDate)
        .ToListAsync();

    return orders.Select(order => MapOrderToDto(order)).ToList();
}
}
