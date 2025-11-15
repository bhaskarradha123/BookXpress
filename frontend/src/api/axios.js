import axios from "axios";

const API = axios.create({
  baseURL:'https://bookxpress-t5vz.onrender.com/api',
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});




// =====================
// AUTH APIs
// =====================

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);
export const resetPassword = (data) => API.post("/auth/reset-password", data);


// =====================
// BOOK APIs
// =====================

// Public
export const getAllBooks = () => API.get("/books");
export const getBookById = (id) => API.get(`/books/${id}`);

// Seller only
export const addBook = (data) => API.post("/books", data);
export const updateBook = (id, data) => API.put(`/books/${id}`, data);
export const deleteBook = (id) => API.delete(`/books/${id}`);
export const getSellerBooks = () => API.get("/books/seller/me");



// =====================
// WISHLIST APIs (Corrected)
// =====================

// Add to wishlist
export const addToWishlist = (bookId) =>
  API.post("/wishlist/add", { bookId });

// Remove from wishlist (your backend uses DELETE and params)
export const removeFromWishlist = (bookId) =>
  API.delete(`/wishlist/remove/${bookId}`);

// Get wishlist
export const getWishlist = () => API.get("/wishlist");



// =====================
// CART APIs
// =====================

export const addBookToCart = (bookId, quantity = 1) =>
  API.post("/cart/add", { bookId, quantity });

export const removeBookFromCart = (bookId) =>
  API.post("/cart/remove", { bookId });

export const updateBookCartQuantity = (bookId, quantity) =>
  API.post("/cart/update", { bookId, quantity });

export const getBookCart = () => API.get("/cart");


// =====================
// ORDER APIs
// =====================

export const placeOrder = (data) => API.post("/orders", data);
export const getMyOrders = () => API.get("/orders/my");
export const getOrderById = (id) => API.get(`/orders/${id}`);


// =====================
// Cloudinary Upload API
// =====================
export const uploadImage=(img)=>{
            let formData = new FormData();
            formData.append('file', img);
            formData.append('upload_preset', 'BookXpress');
  return  axios.post('https://api.cloudinary.com/v1_1/dsbwkapof/image/upload',formData)
};

export default API;