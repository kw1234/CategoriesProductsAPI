# CategoriesProductsAPI

The Entities in this API are “Categories” and “Products”. This API can create, read, and update said entities.

### Categories
- Category can have multiple child categories.
- Child category can have further child categories.
- A category can have multiple products

### Products
- A Product can have multiple categories
- A Product has metadata such as price, etc.

### API Requirements
- The Entities must get saved in MongoDb and be retrieved via POST and GET methods respectively.
- The API should be able to
  1. Add a category
  2. Add Product mapped to a category or categories.
  3. Get all categories with all its child categories mapped to it. Note : Each category object should look something like this {Id : 1 , child_categories: [], ...}
  4. Get all products by a category.
  5. Update product details (name,price,etc)
  
# Implementation Plan
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

## Possible Errors/Oversights
1. This is the main one: when a product entry is created, it can have categories that aren't present in the actual Categories collection. This problem was in my mind since the beginning, but I thought to let it go. I let it go because I did not see it in the scope of the assignment. If this API was part of a live product, I would handle it as such:
   - Upon creation of a Product entry, its "categories" field must be validated.
   - The validation would entail checking if each category present in the "categories" list is present in a category or childCategory in the Categories collection.
   - Whichever of the categories in this new Product entry that were not seen in the Categories collection would be added to the childCategories list under an always existing "Miscellaneous" entry in the Categories collection.
   - This "Miscellaneous" entry would have to be constantly iterated through, and its childCategories added as categories accordingly to the Categories collection
2. Tried to catch and handle all errors gracefully, but an oversight may have happened
3. Did not write unit tests, but I did think that I probably should :)

## Installation

This app will be hosted so installation is not necessary. It is for a one time usage in an assignment.

The code can of course be downloaded and run with:
```
npm install
node server.js
```
There just may be some errors with regards to the MongoCloud database side of things.

If installation is truly desired, this app works with MongoCloud as the database. The user will have to create a MongoCloud database with two tables, 1) Categories and 2) Products. The user will then have to insert/replace/hardcode their credentials and database/collection names into the categoryService.js and productService.js files. Alternatively, the user can use a .env file to keep their credentials safe. The app should work locally or on a hosted instance after that.

# Using the API

- The API can be accessed at the route http://localhost:8080/categories or http://localhost:8080/products
- To add an entry to either collection, query the route http://localhost:8080/categories/postCategory or http://localhost:8080/products/postProduct
  - The data being sent in the POST request needs to match the schemas in the above section for the request to be valid
- To get an entry from either collection, query the route http://localhost:8080/categories/getOne or http://localhost:8080/products/getProduct
- To get all category entries, query http://localhost:8080/categories/getAll
- To get all products under a certain category, query http://localhost:8080/products/getProductsByCategory
- To update an entry by name, use http://localhost:8080/categories/updateCategory or http://localhost:8080/products/updateProduct

The app should be hosted, so the endpoint in the above section will be changed as needed.

### Curl Examples:
```
// POST Category
curl -X POST -H "Content-Type: application/json" -d '{"name": "School", "childCategories": [{"name": "Books",  "childCategories": []}, {"name": "Bags", "childCategories": []}, {"name": "Pencils", "childCategories": []}]}' http://localhost:8080/categories/postCategory

// GET Category by name
curl -X GET -H "Content-Type: application/json" -d '{"name": "School"}' http://localhost:8080/categories/getOne

// GET all Categories
curl http://localhost:8080/categories/getAll

// Update/PUT Category by name
curl -X PUT -H "Content-Type: application/json" -d '{"name":"School", "update" : {"childCategories": [{"name": "Books",  "childCategories": []}, {"name": "Bags", "childCategories": []}, {"name": "Pencils", "childCategories": []}, {"name": "Paper", "childCategories": []}]}}' http://localhost:8080/categories/updateCategory


// POST Product
curl -X POST -H "Content-Type: application/json" -d '{"name": "ScienceBook", "categories": ["Books", "Science"], "price": "12.2"}' http://localhost:8080/products/postProduct

// GET Product by name
curl -X GET -H "Content-Type: application/json" -d '{"name": "ScienceBook"}' http://localhost:8080/products/getProduct

// GET Products by Category name
curl -X GET -H "Content-Type: application/json" -d '{"name": "Books"}' http://localhost:8080/products/getProductsByCategory

// Update/PUT Product
curl -X PUT -H "Content-Type: application/json" -d '{"name":"ScienceBook", "update" :{"price":"15"}}' http://localhost:8080/products/updateProduct
```
