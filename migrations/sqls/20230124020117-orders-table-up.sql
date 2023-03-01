CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_status VARCHAR(20),
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);