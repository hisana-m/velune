import { getProducts } from "./products";

const API_URL = "http://localhost:3000";

// --- Cart Helpers ---

export async function getUserCart(userId) {
  if (!userId) return [];

  const [products, cartRes] = await Promise.all([
    getProducts(),
    fetch(`${API_URL}/cart`),
  ]);

  if (!cartRes.ok) {
    throw new Error("Failed to fetch cart items");
  }

  const allCart = await cartRes.json();
  const userCart = allCart.filter(
    (item) => String(item.userId) === String(userId)
  );

  return userCart
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
  if (!userId) {
    throw new Error("Please log in first.");
  }
  if (!product || !product.id) {
    throw new Error("Invalid product.");
  }

  const cartRes = await fetch(`${API_URL}/cart`);
  if (!cartRes.ok) {
    throw new Error("Failed to load cart");
  }

  const allCart = await cartRes.json();
  const existing = allCart.find(
    (item) =>
      String(item.userId) === String(userId) &&
      String(item.productId) === String(product.id)
  );

  const stock = Number(product.stock ?? 0);
  const addQty = Number(quantity) || 1;
  const targetQty = (existing ? Number(existing.quantity) : 0) + addQty;

  if (stock > 0 && targetQty > stock) {
    throw new Error(`Only ${stock} unit(s) available in stock.`);
  }

  if (existing) {
    const updateRes = await fetch(`${API_URL}/cart/${existing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: targetQty }),
    });
    if (!updateRes.ok) {
      throw new Error("Failed to update cart item quantity");
    }
  } else {
    const createRes = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: String(userId),
        productId: String(product.id),
        quantity: addQty,
      }),
    });
    if (!createRes.ok) {
      throw new Error("Failed to add item to cart");
    }
  }

  return await getUserCart(userId);
}

export async function changeCartQuantity(userId, productId, delta) {
  if (!userId) {
    throw new Error("Please log in first.");
  }

  const [products, cartRes] = await Promise.all([
    getProducts(),
    fetch(`${API_URL}/cart`),
  ]);

  if (!cartRes.ok) {
    throw new Error("Failed to load cart");
  }

  const allCart = await cartRes.json();
  const existing = allCart.find(
    (item) =>
      String(item.userId) === String(userId) &&
      String(item.productId) === String(productId)
  );

  if (!existing) {
    return await getUserCart(userId);
  }

  const newQty = Number(existing.quantity) + delta;

  if (newQty <= 0) {
    await fetch(`${API_URL}/cart/${existing.id}`, {
      method: "DELETE",
    });
  } else {
    if (delta > 0) {
      const product = products.find(
        (p) => String(p.id) === String(productId)
      );
      const stock = Number(product?.stock ?? 0);
      if (stock > 0 && newQty > stock) {
        throw new Error("Maximum stock reached.");
      }
    }

    const updateRes = await fetch(`${API_URL}/cart/${existing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQty }),
    });
    if (!updateRes.ok) {
      throw new Error("Failed to update cart quantity");
    }
  }

  return await getUserCart(userId);
}

export async function deleteCartItem(userId, productId) {
  if (!userId) {
    throw new Error("Please log in first.");
  }

  const cartRes = await fetch(`${API_URL}/cart`);
  if (!cartRes.ok) {
    throw new Error("Failed to load cart");
  }

  const allCart = await cartRes.json();
  const existing = allCart.find(
    (item) =>
      String(item.userId) === String(userId) &&
      String(item.productId) === String(productId)
  );

  if (existing) {
    const delRes = await fetch(`${API_URL}/cart/${existing.id}`, {
      method: "DELETE",
    });
    if (!delRes.ok) {
      throw new Error("Failed to remove item from cart");
    }
  }

  return await getUserCart(userId);
}

export async function emptyUserCart(userId) {
  if (!userId) return [];

  const cartRes = await fetch(`${API_URL}/cart`);
  if (!cartRes.ok) {
    throw new Error("Failed to load cart");
  }

  const allCart = await cartRes.json();
  const userItems = allCart.filter(
    (item) => String(item.userId) === String(userId)
  );

  await Promise.all(
    userItems.map((item) =>
      fetch(`${API_URL}/cart/${item.id}`, { method: "DELETE" })
    )
  );

  return [];
}

// --- Wishlist Helpers ---

export async function getUserWishlist(userId) {
  if (!userId) return [];

  const [products, wishlistRes] = await Promise.all([
    getProducts(),
    fetch(`${API_URL}/wishlist`),
  ]);

  if (!wishlistRes.ok) {
    throw new Error("Failed to fetch wishlist");
  }

  const allWishlist = await wishlistRes.json();
  const userWishlist = allWishlist.filter(
    (item) => String(item.userId) === String(userId)
  );

  return userWishlist
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
  if (!userId) {
    throw new Error("Please log in first.");
  }
  if (!product || !product.id) {
    throw new Error("Invalid product.");
  }

  const wishlistRes = await fetch(`${API_URL}/wishlist`);
  if (!wishlistRes.ok) {
    throw new Error("Failed to load wishlist");
  }

  const allWishlist = await wishlistRes.json();
  const existing = allWishlist.find(
    (item) =>
      String(item.userId) === String(userId) &&
      String(item.productId) === String(product.id)
  );

  if (existing) {
    const delRes = await fetch(`${API_URL}/wishlist/${existing.id}`, {
      method: "DELETE",
    });
    if (!delRes.ok) {
      throw new Error("Failed to remove item from wishlist");
    }
  } else {
    const addRes = await fetch(`${API_URL}/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: String(userId),
        productId: String(product.id),
      }),
    });
    if (!addRes.ok) {
      throw new Error("Failed to add item to wishlist");
    }
  }

  return await getUserWishlist(userId);
}

export async function deleteWishlistItem(userId, productId) {
  if (!userId) {
    throw new Error("Please log in first.");
  }

  const wishlistRes = await fetch(`${API_URL}/wishlist`);
  if (!wishlistRes.ok) {
    throw new Error("Failed to load wishlist");
  }

  const allWishlist = await wishlistRes.json();
  const existing = allWishlist.find(
    (item) =>
      String(item.userId) === String(userId) &&
      String(item.productId) === String(productId)
  );

  if (existing) {
    const delRes = await fetch(`${API_URL}/wishlist/${existing.id}`, {
      method: "DELETE",
    });
    if (!delRes.ok) {
      throw new Error("Failed to remove item from wishlist");
    }
  }

  return await getUserWishlist(userId);
}

export async function emptyUserWishlist(userId) {
  if (!userId) return [];

  const wishlistRes = await fetch(`${API_URL}/wishlist`);
  if (!wishlistRes.ok) {
    throw new Error("Failed to load wishlist");
  }

  const allWishlist = await wishlistRes.json();
  const userItems = allWishlist.filter(
    (item) => String(item.userId) === String(userId)
  );

  await Promise.all(
    userItems.map((item) =>
      fetch(`${API_URL}/wishlist/${item.id}`, { method: "DELETE" })
    )
  );

  return [];
}
