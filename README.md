# CategoriesProductsAPI

The Entities in this API are “Categories” and “Products”. This API can create, read, and update said entities.

### Categories
- Category can have multiple child categories.
- Child category can have further child categories.
- A category can have multiple products

### Products
- A Product can have multiple categories
- A Product 
- A product can have a multiple categories.

### API Requirements
- The Entities must get saved in MongoDb and be retrieved via POST and GET methods respectively.
- The API should be able to
  1. Add a category
  2. Add Product mapped to a category or categories.
  3. Get all categories with all its child categories mapped to it. Note : Each category object should look something like this {Id : 1 , child_categories: [], ...}
  4. Get all products by a category.
  5. Update product details (name,price,etc)
  
## Implementation Plan
- Node.js and Express will implement the backend server.
- MongoDB Cloud will be used for the database.
- To use the api, typical tools to query a REST API (curl, Postman, etc.) should be used
- A possible index.html with embedded JavaScript could be present as an added bonus. Maybe even a more fleshed out UI (must first work on the backend side first before ever touching the frontend, though).

- Schema of a Category:
```
{
  _id: String, //added on insertion by MongoDB
  name: String,
  childCategories: Array[]
}
```

- Schema of a Product
```
{
  _id: String, //added on insertion by MongoDB
  name: String,
  price: Double,
  categories: Array[]
}
```

**add a category:** simply write an that contains the category fields<br>
**add a product:** write an object that contains the product fields<br>
**get all categories:** do a read of all the entries in the categories collection. To get a specific category, do a specific find based on categoryId or name<br>
**get all products under a category:** do a find amongst all products where a selected product will have the desired category name in their category list<br>
**update category details:** do a mongo update based on the categoryId or name<br>
**update product details:** do a mongo update based on the productID or name<br>

## Installation

This app will be hosted so installation is not necessary.

If installation is truly desired, this app works with MongoCloud as the database. The user will have to create a MongoCloud database with two tables, 1) Categories and 2) Products. The user will then have to insert/replace/hardcode their credentials and database/collection names into the categoryService.js and productService.js files. The app should work locally or on a hosted instance after that.

## Using the API

- The API can be accessed at the route http://localhost:8080/categories or http://localhost:8080/products
- To add an entry to either collection, query the route http://localhost:8080/categories/postData or http://localhost:8080/products/postData
  - The data being sent in the POST request needs to match the schemas in the above section for the request to be valid
- To get an entry from either collection, query the route http://localhost:8080/categories/getData or http://localhost:8080/products/getData

The app should be hosted, so the endpoint in the above section will be changed as needed.

# LAAALAALALALALAL REMOVE BELOWWWW
# Usage: The next section is usage, in which you instruct other people on how to use your project after they’ve installed it. This would also be a good place to include screenshots of your project in action.
