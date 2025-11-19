import React, { useState } from "react";
import { addBook } from "../../src/api/axios";
import { uploadImage } from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imgUrl = form.image;

      if (imgFile) {
        const uploadRes = await uploadImage(imgFile);
        imgUrl = uploadRes.data.secure_url;
      }

      await addBook({ ...form, image: imgUrl });
      toast.success("Book added successfully!");
      navigate("/manageBooks");

    } catch (error) {
      toast.error("Error adding book");
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-blue-200 to-blue-50 p-27">

      <div className="w-full max-w-4xl bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/30">

        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Add New Book 📚
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT SIDE FORM */}
          <div className="space-y-5">

            <div>
              <label className="text-gray-700 font-semibold">Book Title</label>
              <input
                placeholder="Enter book title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-white/80 px-4 py-3 rounded-xl shadow-sm border
                focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold">Author</label>
              <input
                placeholder="Author name"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full bg-white/80 px-4 py-3 rounded-xl shadow-sm border
                focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold">Category</label>
              <input
                placeholder="Category (e.g., Fiction)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-white/80 px-4 py-3 rounded-xl shadow-sm border
                focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div className="flex gap-5">
              <div className="flex-1">
                <label className="text-gray-700 font-semibold">Price (₹)</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-white/80 px-4 py-3 rounded-xl shadow-sm border
                  focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="text-gray-700 font-semibold">Stock</label>
                <input
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full bg-white/80 px-4 py-3 rounded-xl shadow-sm border
                  focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>

          </div>

          {/* RIGHT SIDE - DESCRIPTION & IMAGE */}
          <div className="space-y-5">

            <div>
              <label className="text-gray-700 font-semibold">Description</label>
              <textarea
                placeholder="Enter book description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full h-[120px] bg-white/80 px-4 py-3 rounded-xl shadow-sm border
                focus:ring-2 focus:ring-blue-400 outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold">Book Cover Image</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full bg-white px-3 py-2 rounded-xl border shadow"
              />
            </div>

            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 h-52 object-cover rounded-xl shadow-lg border"
                />
              </div>
            )}

          </div>
        </form>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          className="mt-10 w-full py-4 text-xl font-bold text-white rounded-xl
          bg-gradient-to-r from-blue-600 to-blue-500
          hover:scale-[1.03] transition shadow-lg"
        >
          Add Book
        </button>

      </div>
    </div>
  );
};

export default AddBook;
