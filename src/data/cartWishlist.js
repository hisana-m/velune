
import { getProducts } from "./products";

const API_URL = "http://localhost:3000";

// ---------------- COMMON HELPERS ----------------

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }

  if (response.status === 204) return null;

  return response.json();
}

// ---------------- CART HELPERS ----------------

export async function getUserCart(userId) {
  if (!userId) return [];

  const [products, allCart] = await Promise.all([
    getProducts(),
    apiRequest("/cart"),
  ]);

  return allCart
    .filter((item) => String(item.userId) === String(userId))
    .map((entry) => {
      const product = products.find(
        (p) => String(p.id) === String(entry.productId)
      );

      if (!product) return null;

      return {
        ...product,
        id: product.id,
        cartId: entry.id,
        quantity: Number(entry.quantity) || 1,
      };
    })
    .filter(Boolean);
}

export async function addCartItem(userId, product, quantity = 1) {
  if (!userId) throw new Error("Please log in first.");

  if (!product?.id) throw new Error("Invalid product.");

  const allCart = await apiRequest("/cart");

  const existing = allCart.find(
    (item) =>
      String(item.userId) === String(userId) &&
      String(item.productId) === String(product.id)
  );

  const stock = Number(product.stock ?? 0);
  const addQty = Math.max(1, Number(quantity) || 1);
  const currentQty = existing ? Number(existing.quantity) || 0 : 0;
  const targetQty = currentQty + addQty;

  if (stock <= 0) {
    throw new Error("This product is out of stock.");
  }

  if (targetQty > stock) {
    throw new Error(`Only ${stock} unit(s) available in stock.`);
  }

  if (existing) {
    await apiRequest(`/cart/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity: targetQty }),
    });
  } else {
    await apiRequest("/cart", {
      method: "POST",
      body: JSON.stringify({
        userId: String(userId),
        productId: String(product.id),
        quantity: addQty,
      }),
    });
  }

  return getUserCart(userId);
}

export async function changeCartQuantity(userId, productId, delta) {
  if (!userId) throw new Error("Please log in first.");

  const [products, allCart] = await Promise.all([
    getProducts(),
    apiRequest("/cart"),
  ]);

  const existing = allCart.find(
    (item) =>
      String(item.userId) === String(userId) &&
      String(item.productId) === String(productId)
  );

  if (!existing) return getUserCart(userId);

  const newQty = (Number(existing.quantity) || 0) + delta;

  if (newQty <= 0) {
    await apiRequest(`/cart/${existing.id}`, {
      method: "DELETE",
    });

    return getUserCart(userId);
  }

  const product = products.find(
    (p) => String(p.id) === String(productId)
  );

  if (delta > 0) {
    const stock = Number(product?.stock ?? 0);

    if (newQty > stock) {
      throw new Error("Maximum stock reached.");
    }
  }

  await apiRequest(`/cart/${existing.id}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity: newQty }),
  });

  return getUserCart(userId);
}

export async function deleteCartItem(userId, productId) {
  if (!userId) throw new Error("Please log in first.");

  const allCart = await apiRequest("/cart");

  const existing = allCart.find(
    (item) =>
      String(item.userId) === String(userId) &&
      String(item.productId) === String(productId)
  );

  if (existing) {
    await apiRequest(`/cart/${existing.id}`, {
      method: "DELETE",
    });
  }

  return getUserCart(userId);
}

export async function emptyUserCart(userId) {
  if (!userId) return [];

  const allCart = await apiRequest("/cart");

  const userItems = allCart.filter(
    (item) => String(item.userId) === String(userId)
  );

  await Promise.all(
    userItems.map((item) =>
      apiRequest(`/cart/${item.id}`, {
        method: "DELETE",
      })
    )
  );

  return [];
}

// ---------------- WISHLIST HELPERS ----------------

export async function getUserWishlist(userId) {
  if (!userId) return [];

  const [products, allWishlist] = await Promise.all([
    getProducts(),
    apiRequest("/wishlist"),
  ]);

  return allWishlist
    .filter((item) => String(item.userId) === String(userId))
    .map((entry) => {
      const product = products.find(
        (p) => String(p.id) === String(entry.productId)
      );

      if (!product) return null;

      return {
        ...product,
        id: product.id,
        wishlistId: entry.id,
      };
    })
    .filter(Boolean);
}

export async function toggleWishlistItem(userId, product) {
  if (!userId) throw new Error("Please log in first.");

  if (!product?.id) throw new Error("Invalid product.");

  const allWishlist = await apiRequest("/wishlist");

  const existing = allWishlist.find(
    (item) =>
      String(item.userId) === String(userId) &&
      String(item.productId) === String(product.id)
  );

  if (existing) {
    await apiRequest(`/wishlist/${existing.id}`, {
      method: "DELETE",
    });
  } else {
    await apiRequest("/wishlist", {
      method: "POST",
      body: JSON.stringify({
        userId: String(userId),
        productId: String(product.id),
      }),
    });
  }

  return getUserWishlist(userId);
}

export async function deleteWishlistItem(userId, productId) {
  if (!userId) throw new Error("Please log in first.");

  const allWishlist = await apiRequest("/wishlist");

  const existing = allWishlist.find(
    (item) =>
      String(item.userId) === String(userId) &&
      String(item.productId) === String(productId)
  );

  if (existing) {
    await apiRequest(`/wishlist/${existing.id}`, {
      method: "DELETE",
    });
  }

  return getUserWishlist(userId);
}

export async function emptyUserWishlist(userId) {
  if (!userId) return [];

  const allWishlist = await apiRequest("/wishlist");

  const userItems = allWishlist.filter(
    (item) => String(item.userId) === String(userId)
  );

  await Promise.all(
    userItems.map((item) =>
      apiRequest(`/wishlist/${item.id}`, {
        method: "DELETE",
      })
    )
  );

  return [];
}
