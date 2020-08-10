# CategoriesProductsAPI

The Entities in this API are “Categories” and “Products”.

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
'''
{
  _id: String,
  categoryId: String,
  name: String,
  childCategories: Array[]
}
'''

- Schema of a Product
'''
{
  _id: String,
  productId: String,
  name: String,
  price: int,
  categories: Array[]
}
'''

- **add a category:** simply write an that contains the category fields
- **add a product:** write an object that contains the product fields
- **get all categories:** do a read of all the entries in the categories collection. To get a specific category, do a specific find based on categoryId or name
- **get all products under a category:** do a find amongst all products where a selected product will have the desired category name in their category list
- **update category details:** do a mongo update based on the categoryId or name
- **update product details:** do a mongo update based on the productID or name

## Using the API

### Blah (Being updated ... )

Description: A description of your project follows. A good description is clear, short, and to the point. Describe the importance of your project, and what it does.

Table of Contents: Optionally, include a table of contents in order to allow other people to quickly navigate especially long or detailed READMEs.

Installation: Installation is the next section in an effective README. Tell other users how to install your project locally. Optionally, include a gif to make the process even more clear for other people.

Usage: The next section is usage, in which you instruct other people on how to use your project after they’ve installed it. This would also be a good place to include screenshots of your project in action.
