const API_URL = "http://localhost:3000";

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getBestSellers() {
  const products = await getProducts();
  return products.filter((product) => product.isBestSeller);
}

export async function getProductsByCategory(categorySlug) {
  const products = await getProducts();

  return products.filter(
    (product) => product.categorySlug === categorySlug
  );
}

export async function getProductById(id) {
  const products = await getProducts();

  return products.find(
    (product) => Number(product.id) === Number(id)
  );
}

export function formatPrice(price) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 2,
  }).format(price);
}
