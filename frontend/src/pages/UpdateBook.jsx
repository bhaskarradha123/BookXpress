import React, { useEffect, useState } from "react";
import { getBookById, updateBook, uploadImage } from "../../src/api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    stock: 1,
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await getBookById(id);
        const data = res.data;

        setForm({
          title: data.title,
          author: data.author,
          category: data.category,
          price: data.price,
          stock: data.stock,
          description: data.description,
          image: data.image,
        });

        setPreview(data.image);
        setLoading(false);
      } catch (error) {
        toast.error("Error loading book details");
      }
    };

    fetchBook();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImgFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imgUrl = form.image;

      if (imgFile) {
        const uploadRes = await uploadImage(imgFile);
        imgUrl = uploadRes.data.secure_url;
      }

      await updateBook(id, { ...form, image: imgUrl });

      toast.success("Book updated successfully!");
      navigate("/manageBooks");
    } catch (error) {
      toast.error("Error updating book");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-lg font-semibold text-gray-600">
        Loading book details...
      </p>
    );

  return (
    <div className="min-h-screen flex justify-center items-center bg-cover bg-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 py-20 px-6">

      <div className="w-full max-w-3xl bg-white/30 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/40">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 drop-shadow">
          ✏️ Update Book
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <input
            placeholder="Book Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 rounded-xl bg-white/60 shadow-sm outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-400"
          />

          {/* Author */}
          <input
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full p-3 rounded-xl bg-white/60 shadow-sm outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-400"
          />

          {/* Category */}
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full p-3 rounded-xl bg-white/60 shadow-sm outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-400"
          />

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/60 shadow-sm outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-400"
            />
            <input
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/60 shadow-sm outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Description */}
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-3 rounded-xl bg-white/60 shadow-sm outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-400 h-32"
          />

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-700">
              Change Image (optional)
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 rounded-xl bg-white/70 border border-gray-300 shadow-sm"
            />
          </div>

          {/* Image Preview */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-40 h-52 object-cover rounded-xl shadow-lg mx-auto border border-white/50"
            />
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 hover:scale-[1.03] transition-all"
          >
            Update Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;
