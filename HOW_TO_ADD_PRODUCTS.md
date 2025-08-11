# How to Add Products to GlowKart

If you're seeing an empty product listing, here are several ways to add products to the system:

## Method 1: Using the Sample Data Script (Already Done)
We've already added sample products to your database using the script. You should now see products when you view businesses.

## Method 2: Using the Web Interface

1. **Navigate to the Add Product Page:**
   - Go to the "Businesses" page
   - Click on a business to view its details
   - Click the "Add Product" button

2. **Fill in Product Details:**
   - Product Name (required)
   - Product Description (required)
   - Price (required)
   - Category (required)
   - Product Image URL (optional)

3. **Submit the Form:**
   - Click "Add Product" to save your new product

## Method 3: Using the API Directly

You can also add products using the API endpoints:

- **Create Product:** POST `/api/products`
- **Get All Products:** GET `/api/products`
- **Get Products by Store:** GET `/api/products/store/:storeId`
- **Update Product:** PUT `/api/products/:id`
- **Delete Product:** DELETE `/api/products/:id`

## Authentication

To create products via the API, you'll need to be authenticated as a vendor or admin. Make sure to include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Product Fields

When creating a product, the following fields are supported:

- `name` (String, required) - Product name
- `description` (String) - Product description
- `price` (Number, required) - Product price
- `category` (String, required) - Product category
- `image` (String) - Product image URL
- `store` (ObjectId, required) - Store that sells the product
- `createdBy` (ObjectId, required) - User who created the product

## Next Steps

1. Visit the Businesses page to see your products
2. Try adding a product through the web interface
3. Check the cart functionality by adding products to your cart
4. Explore the checkout process

If you have any questions or run into issues, please check the console for error messages or contact support.