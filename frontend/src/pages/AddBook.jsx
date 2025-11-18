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

      // Upload image if selected
      if (imgFile) {
        const uploadRes = await uploadImage(imgFile);
        imgUrl = uploadRes.data.secure_url;
      }

      // Send data to backend
      await addBook({
        ...form,
        image: imgUrl,
      });

      toast.success("Book added successfully");
        navigate("/manageBooks");
    } catch (error) {
      console.log(error);
      toast.error("Error adding book");
    }
  };

  return (
    <div className="container mx-auto p-34">
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Author"
        value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })}
      />

      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <input
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <input
        placeholder="Stock"
        type="number"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input type="file" onChange={handleImageChange} />

      {preview && <img width="120" src={preview} alt="preview" />}

      <button type="submit">Add Book</button>
    </form>
    </div>    
  );};

export default AddBook;
