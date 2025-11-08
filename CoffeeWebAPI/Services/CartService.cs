using System;
using CoffeeWebAPI.Data;
using CoffeeWebAPI.Dtos;
using CoffeeWebAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace CoffeeWebAPI.Services;

public class CartService: ICartService
{
    private readonly CoffeeShopContext _context;

    public CartService(CoffeeShopContext context)
    {
        _context = context;
    }

    public async Task<OrderDto> GetOrCreateCartAsync(int userId)
    {
        var cart = await _context.Orders
            .Include(o => o.Items)
                .ThenInclude(item => item.Product)
            .FirstOrDefaultAsync(o => o.UserId == userId && o.Status == "Pending");

        if (cart == null)
        {
            cart = new Order
            {
                UserId = userId,
                Status = "Pending",
                OrderDate = DateTime.Now,
                Items = new List<Ordered>()
            };

            _context.Orders.Add(cart);
            await _context.SaveChangesAsync();
        }
        return MapCartToDto(cart);
    }
    
    public async Task<OrderDto> AddItemToCartAsync(int userId, int productId)
    {
        var cart = await _context.Orders
            .FirstOrDefaultAsync(o => o.UserId == userId && o.Status == "Pending");

        if (cart == null)
        {
            cart = new Order
            {
                UserId = userId,
                Status = "Pending",
                Items = new List<Ordered>()
            };
            _context.Orders.Add(cart);
            await _context.SaveChangesAsync();
        }

        var product = await _context.Products.FindAsync(productId);
        if (product == null)
        {
            throw new Exception("A termék nem található.");
        }

        var cartItem = await _context.Ordereds.FirstOrDefaultAsync(
            oi => oi.OrderId == cart.OrderId && oi.ProductId == productId
        );

        if (cartItem == null)
        {

            if (product.Quantity < 1)
            {
                throw new Exception("A termék jelenleg nincs készleten.");
            }
            
            cartItem = new Ordered
            {
                OrderId = cart.OrderId,
                ProductId = productId,
                Quantity = 1,
                UnitPrice = product.Price
            };

            _context.Ordereds.Add(cartItem);
        }
        else
        {

            if (product.Quantity <= cartItem.Quantity)
            {
                throw new Exception("Nincs több készleten ebből a termékből.");
            }

            cartItem.Quantity++;
        }

        await _context.SaveChangesAsync();

        return await GetOrCreateCartAsync(userId);
    }

    public async Task<OrderDto> RemoveItemFromCartAsync(int userId, int orderedItemId)
{

    var cart = await _context.Orders
        .FirstOrDefaultAsync(o => o.UserId == userId && o.Status == "Pending");

    if (cart == null)
    {
        throw new Exception("A kosár nem található.");
    }

    var cartItem = await _context.Ordereds
        .FirstOrDefaultAsync(oi => oi.OrderedId == orderedItemId && oi.OrderId == cart.OrderId);
        
    if (cartItem != null)
    {

        _context.Ordereds.Remove(cartItem);
        await _context.SaveChangesAsync();
    }

    return await GetOrCreateCartAsync(userId);
}

public async Task<OrderDto> UpdateItemQuantityAsync(int userId, int orderedItemId, int newQuantity)
{
    if (newQuantity <= 0)
    {
        return await RemoveItemFromCartAsync(userId, orderedItemId);
    }

    var cart = await _context.Orders
        .FirstOrDefaultAsync(o => o.UserId == userId && o.Status == "Pending");

    if (cart == null)
    {
        throw new Exception("A kosár nem található.");
    }

    var cartItem = await _context.Ordereds
        .Include(oi => oi.Product)
        .FirstOrDefaultAsync(oi => oi.OrderedId == orderedItemId && oi.OrderId == cart.OrderId);

    if (cartItem == null)
    {
        throw new Exception("A kosárban lévő tétel nem található.");
    }

    if (cartItem.Product.Quantity < newQuantity)
    {

        throw new Exception($"Sajnos nincs elég termék készleten. Elérhető: {cartItem.Product.Quantity} db");
    }

    cartItem.Quantity = newQuantity;
    await _context.SaveChangesAsync();

    return await GetOrCreateCartAsync(userId);
}

    private OrderDto MapCartToDto(Order cart)
    {
        return new OrderDto
        {
            OrderId = cart.OrderId,
            UserId = cart.UserId,
            OrderDate = cart.OrderDate,
            // Most már át tudjuk adni a részletes termékinfókat a javított DTO-val
            Items = cart.Items.Select(item => new OrderedDto
            {
                OrderedId = item.OrderedId, // Ez a kosár-tétel ID-ja!
                ProductId = item.ProductId,
                Name = item.Product.Name,
                Price = item.Product.Price,
                Image = item.Product.Image,
                Quantity = item.Quantity
            }).ToList()
        };
    }
}
