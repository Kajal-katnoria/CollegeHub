"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Product() {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        console.log("FETCHING PRODUCT ID:", id);

        const res = await fetch(
          "https://collegehub-backend-kesi.onrender.com/api/items/${id}"
        );

        console.log("PRODUCT RESPONSE STATUS:", res.status);

        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status}`);
        }

        const data = await res.json();

        console.log("PRODUCT DATA:", data);

        setProduct(data);
      } catch (err) {
        console.error("FETCH PRODUCT ERROR:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>{product.title}</h1>

      <p>{product.description}</p>

      <h2>₹{product.price}</h2>

      <p>Category: {product.category}</p>

      <p>Status: {product.status}</p>

      <p>Seller: {product.seller?.name}</p>

      {product.image && (
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: "300px",
            height: "300px",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
}