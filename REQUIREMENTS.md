# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index (GET `/products` )
- Show (GET `/products/:id`)
- Create [token required] (POST `/product`)
- Update [token required] (PUT `/product`)
- Delete [token required] (DELETE `/product/:id`)

#### Users

- Index [token required] (GET `/users`)
- Show [token required] (GET `/user/:id`)
- Create (POST `/user`)
- Update [token required] (PUT `/users/:id`)
- Delete [token required] (DELETE `/users/:id`)

#### Orders

- Index [token required] (GET `/orders`)
- Show [token required] (GET `/order/:id`)
- Create [token required] (POST `/order`)
- Update [token required] (PUT `/order/:id`)
- Delete [token required] (DELETE `/order/:id`)

## Data Shapes

#### Product

- id
- product_name
- product_price
  The SQL schema for this table is as follows:

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_price INT NOT NULL
)
```

#### User

- id
- user_name
- first_name
- last_name
- password
  The SQL schema for this table is as follows:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
)
```

#### Orders

- id
- order_status(active or complete)
- user_id
  The SQL schema for this table is as follows:

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_status VARCHAR(20),
    user_id INT REFERENCES users(id) ON DELETE CASCADE
)
```

#### order_products

The table includes the following fields:

- id
- product_id
- order_id
- order_product_quantity
  The SQL schema for this table is as follows:

```sql
CREATE TABLE orders_products (
    id SERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    order_product_quantity INT
)
```
