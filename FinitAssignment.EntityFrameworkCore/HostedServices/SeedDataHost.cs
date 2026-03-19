using FinitAssignment.Categories;
using FinitAssignment.EntityFrameworkCore;
using FinitAssignment.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace FinitAssignment.HostedServices;

public class SeedDataHost(IServiceScopeFactory scopeFactory) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await using var scope = scopeFactory.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ProductCatalogDbContext>();
        await dbContext.Database.EnsureCreatedAsync(cancellationToken);

        if (await dbContext.Products.AnyAsync(cancellationToken))
            return;

        Category[] categories =
        [
            new Category
            {
                Name = "Decor",
                Description = "Decorative furnitures",
                IsActive = true,
                DisplayOrder = 1,
                ParentId = null,
            },
            new Category
            {
                Name = "Stationery",
                Description = "Writing instruments, notebooks and desk accessories",
                IsActive = true,
                DisplayOrder = 2,
                ParentId = null,
            },
            new Category
            {
                Name = "Kitchen",
                Description = "Cookware, serveware and kitchen tools",
                IsActive = true,
                DisplayOrder = 3,
                ParentId = null,
            },
            new Category
            {
                Name = "Workspace",
                Description = "Desk organisation and office accessories",
                IsActive = true,
                DisplayOrder = 4,
                ParentId = null,
            },
            new Category
            {
                Name = "Textiles",
                Description = "Soft furnishings, throws and woven goods",
                IsActive = true,
                DisplayOrder = 5,
                ParentId = null,
            },
            new Category
            {
                Name = "Home Fragrance",
                Description = "Candles, diffusers and room sprays",
                IsActive = true,
                DisplayOrder = 6,
                ParentId = null,
            },
        ];

        var products = new List<Product>
        {
            new() {
                Name = "Obsidian Desk Lamp",
                Description =
                    "Hand-forged matte black steel with a warm 2700K Edison bulb. Adjustable arm, weighted base.",
                Price = 189.00m,
                ImagePath =
                    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
                Category = categories[0],
                CustomAttributes =
                    """{"material":"Steel","finish":"Matte Black","wattage":"40W"}""",
            },
            new() {
                Name = "Leather Field Notebook",
                Description =
                    "Full-grain vegetable-tanned leather cover. 192 pages of 100gsm ivory paper. Lies flat.",
                Price = 64.50m,
                ImagePath = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
                Category = categories[1],

                CustomAttributes = """{"pages":"192","paper":"100gsm","size":"A5"}""",
            },
            new() {
                Name = "Ceramic Pour-Over Set",
                Description =
                    "Wheel-thrown stoneware dripper and carafe. Glazed interior, raw exterior. Brews 600ml.",
                Price = 112.00m,
                ImagePath =
                    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
                Category = categories[2],
                CustomAttributes =
                    """{"capacity":"600ml","dishwasher":"No","material":"Stoneware"}""",
            },
            new() {
                Name = "Walnut Monitor Stand",
                Description =
                    "Solid American black walnut, hand-sanded to 320 grit. Elevates your screen 12cm.",
                Price = 145.00m,
                ImagePath =
                    "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
                Category = categories[3],
                CustomAttributes =
                    """{"wood":"Black Walnut","height":"12cm","finish":"Danish Oil"}""",
            },
            new() {
                Name = "Merino Throw Blanket",
                Description =
                    "Extra-fine 17.5 micron merino wool. Herringbone weave, hand-hemmed fringe. 130×180cm.",
                Price = 228.00m,
                ImagePath =
                    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80",
                Category = categories[4],
                CustomAttributes = """{"micron":"17.5","size":"130×180cm","care":"Dry Clean"}""",
            },
            new() {
                Name = "Cast Iron Trivet",
                Description =
                    "Raw cast iron with geometric cut-through pattern. Protects surfaces up to 400°C.",
                Price = 47.00m,
                ImagePath = "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80",
                Category = categories[2],
                CustomAttributes =
                    """{"material":"Cast Iron","max_temp":"400°C","pattern":"Geometric"}""",
            },
            new() {
                Name = "Linen Column Candle",
                Description =
                    "100% beeswax blended with linen-scented botanicals. 60-hour burn, unbleached wick.",
                Price = 38.00m,
                ImagePath =
                    "https://images.unsplash.com/photo-1603006905393-c279ecdaa804?w=600&q=80",
                Category = categories[5],
                CustomAttributes = """{"burn_time":"60hr","scent":"Linen","wax":"Beeswax"}""",
            },
            new() {
                Name = "Architect's Pen Set",
                Description =
                    "6 nib sizes in precision-machined brass barrels. Includes ink converter and travel case.",
                Price = 95.00m,
                ImagePath =
                    "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80",
                Category = categories[1],
                CustomAttributes = """{"nibs":"6","material":"Brass","ink":"Converter"}""",
            },
            new() {
                Name = "Brass Wall Clock",
                Description =
                    "Minimalist skeleton dial in brushed brass. Silent quartz movement, 30cm diameter.",
                Price = 134.00m,
                ImagePath =
                    "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&q=80",
                Category = categories[5],
                CustomAttributes =
                    """{"diameter":"30cm","movement":"Quartz","finish":"Brushed Brass"}""",
            },
            new() {
                Name = "Smoked Oak Serving Board",
                Description =
                    "Fumed white oak with juice groove and leather hang strap. 45×22cm cutting surface.",
                Price = 78.00m,
                ImagePath =
                    "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80",
                Category = categories[2],
                CustomAttributes =
                    """{"size":"45×22cm","wood":"Fumed Oak","feature":"Juice Groove"}""",
            },
            new() {
                Name = "Linen Cushion Cover",
                Description =
                    "Stone-washed European linen in a natural undyed finish. Envelope back, 50×50cm.",
                Price = 42.00m,
                ImagePath =
                    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80",
                Category = categories[4],
                CustomAttributes = """{"size":"50×50cm","material":"Linen","closure":"Envelope"}""",
            },
            new() {
                Name = "Concrete Planter Trio",
                Description =
                    "Set of three hand-cast concrete planters with drainage holes. Raw matte finish.",
                Price = 67.00m,
                ImagePath =
                    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80",
                Category = categories[3],
                CustomAttributes = """{"set":"3 pieces","material":"Concrete","drainage":"Yes"}""",
            },
            new() {
                Name = "Matte Black Carafe",
                Description =
                    "Borosilicate glass with matte black silicone sleeve. Holds 1L, dishwasher safe.",
                Price = 54.00m,
                ImagePath = "https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=600&q=80",
                Category = categories[2],
                CustomAttributes =
                    """{"capacity":"1L","material":"Borosilicate","dishwasher":"Yes"}""",
            },
            new() {
                Name = "Woven Storage Basket",
                Description =
                    "Hand-woven seagrass with leather handles. Flat base, 35cm diameter, 28cm tall.",
                Price = 59.00m,
                ImagePath = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
                Category = categories[2],
                CustomAttributes = """{"diameter":"35cm","height":"28cm","material":"Seagrass"}""",
            },
            new() {
                Name = "Typographer's Ruler",
                Description =
                    "Solid stainless steel, laser-etched metric and pica scales. 30cm, non-slip cork backing.",
                Price = 29.00m,
                ImagePath =
                    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
                Category = categories[0],
                CustomAttributes =
                    """{"length":"30cm","material":"Stainless Steel","backing":"Cork"}""",
            },
            new() {
                Name = "Terrazzo Soap Dish",
                Description =
                    "Hand-poured white cement with multicolour stone chips. Drainage ridge base.",
                Price = 24.00m,
                ImagePath = "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
                Category = categories[0],
                CustomAttributes = """{"material":"Terrazzo","drainage":"Yes","finish":"Matte"}""",
            },
            new() {
                Name = "Folding Bone Knife",
                Description =
                    "440C stainless drop-point blade with ox bone handle scales. Liner lock, 8cm blade.",
                Price = 118.00m,
                ImagePath =
                    "https://images.unsplash.com/photo-1611063617785-8e2b47ab5aa0?w=600&q=80",
                Category = categories[0],
                CustomAttributes =
                    """{"blade":"8cm","steel":"440C","handle":"Ox Bone","lock":"Liner"}""",
            },
            new() {
                Name = "Recycled Glass Vase",
                Description =
                    "Mouth-blown from 100% recycled glass. Organic form, slight air-bubble texture. 28cm tall.",
                Price = 86.00m,
                ImagePath =
                    "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80",
                Category = categories[0],
                CustomAttributes =
                    """{"height":"28cm","material":"Recycled Glass","technique":"Mouth-blown"}""",
            },
        };

        dbContext.AddRange(categories);
        dbContext.AddRange(products);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken _)
    {
        return Task.CompletedTask;
    }
}
