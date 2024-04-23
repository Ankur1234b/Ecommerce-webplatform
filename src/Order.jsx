import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
function Order() {
  const [orderData, setOrderData] = useState(null); // State to store order data
  const [productData, setProductData] = useState(null); // State to store product data
  const [loggedInUserID, setLoggedInUserID] = useState(null); // State to store the logged-in user ID

  useEffect(() => {
    // Fetch order data from db.json when the component mounts
    fetch('db.json')
      .then(response => response.json())
      .then(data => {
        setOrderData(data.order);
        setProductData(data.products);
      })
      .catch(error => console.error('Error fetching data:', error));

    // Retrieve user data from local storage
    const userDataFromStorage = JSON.parse(localStorage.getItem('userData'));
    if (userDataFromStorage && userDataFromStorage.length > 0) {
      setLoggedInUserID(userDataFromStorage[0].id);
    }
  }, []); // Empty dependency array to run the effect only once

  // Function to find product details by ID
  const findProductByID = (productId) => {
    return productData.find(product => product.pdid === productId);
  };

  // Function to filter orders by user ID
  const filterOrdersByUserID = () => {
    if (!orderData || !loggedInUserID) return [];
    return orderData.filter(order => order.userid === loggedInUserID);
  };

  const userOrders = filterOrdersByUserID();

  return (
    <div>
      <h1 className='d-flex justify-content-center'>Order</h1>
      <Link to="/" className="home-link "><IoHome /></Link>
      <div className="offset-lg-3 col-lg-6 mt-5">
        <div className="card-header">
        
        </div>
        <div className="card-body ">
          {/* Render order data if available */}
          {userOrders.length > 0 ? (
            userOrders.map((order) => (
              <div key={order.id} className="mb-3 border rounded bg-light p-3 ">
                <div className="card-header">Order ID: {order.id}</div>
                <div className="card-body">
                  <p>User ID: {order.userid}</p>
                  <p>Address: {order.address}</p>
                  <p>Ordered Products:</p>
                  {/* Render cart-like component for each ordered product */}
                  {order.cart.map((item) => {
                    const product = findProductByID(item.pdid);
                    return (
                      <div key={item.id} className="cart">
                        {/* Render product image */}
                        <img src={product.image} alt={product.description} className="cart-image" />
                        {/* Render product details */}
                        <div className="cart-details">
                          <p>Product ID: {product.pdid}</p>
                          <p>Category: {product.category}</p>
                          <p>Brand: {product.brand}</p>
                          <p>Description: {product.description}</p>
                          <p>Price: {product.price}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            // Display a message if user has no orders
            <p>No orders found for this user.</p>
          )}
          {/* Display a message if order data is not available */}
          {!orderData && <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
}

export default Order;
