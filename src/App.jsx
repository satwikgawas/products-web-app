import React, { useState, useEffect } from 'react'

const App = () => {
  const [products, setProducts] = useState([])
  const [productName, setProductName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const response = await fetch(`https://products-api-4b3u.onrender.com/products`)
    const data = await response.json()
    setProducts(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newProduct = { productName, price, category }

    if (editingProduct) {
      // Update product
      await fetch(`https://products-api-4b3u.onrender.com/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      })
    } else {
      // Create product
      await fetch("https://products-api-4b3u.onrender.com/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      })
    }

    // Reset form & reload products
    setProductName("")
    setPrice("")
    setCategory("")
    setEditingProduct(null)
    fetchProducts()
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setProductName(product.productName)
    setPrice(product.price)
    setCategory(product.category)
  }

  const handleDelete = async (id) => {
    await fetch(`https://products-api-4b3u.onrender.com/products/${id}`, { method: "DELETE" })
    fetchProducts()
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Product Manager</h1>

      {/* Product Form */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Product Name</label>
              <input type="text" className="form-control" value={productName} onChange={(e) => setProductName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Price</label>
              <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary me-2">
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
            {editingProduct && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingProduct(null)
                  setProductName("")
                  setPrice("")
                  setCategory("")
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Product Cards */}
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{product.productName}</h5>
                <h6 className="card-subtitle mb-2 text-muted">${product.price}</h6>
                <p className="card-text">Category: {product.category}</p>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(product)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
