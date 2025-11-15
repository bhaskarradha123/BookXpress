import React, { useEffect, useState } from "react";
import { getBookById, updateBook } from "../../src/api/axios";
import { uploadImage } from "../../src/api/axios";
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

  // Fetch existing book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await getBookById(id);
        
        const data = res.data;
       
        setForm({
          title: data.title|| "",
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
        console.error(error);
        alert("Error loading book");
      }
    };

    fetchBook();
  }, [id]);

  // image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImgFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
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
      console.error(error);
      toast.error("Error updating book");
    }
  };

  if (loading) return <p>Loading book details...</p>;

  return (
    <form onSubmit={handleSubmit} className="update-form">

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

      <div>
        <label>Change Image (optional)</label>
        <input type="file" onChange={handleImageChange} />
      </div>

      {preview && (
        <img
          src={preview}
          alt="preview"
          width="150"
          style={{ marginTop: "10px", borderRadius: "8px" }}
        />
      )}

      <button type="submit">Update Book</button>
    </form>
  );
};

export default UpdateBook;
