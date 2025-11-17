import React, { useEffect, useState } from "react";
import { deleteUserAccount, getUserProfile, updateUserAddress, updateUserProfile } from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);

  // Editable forms
  const [profileData, setProfileData] = useState({
    name: "",
    gender: "",
    phone: "",
  });

  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    state: "",
    pinCode: "",
    doorNo: ""
  });
  // Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();

        setUser(res.data.user);

        // preload forms
        setProfileData({
          name: res.data.user.name || "",
          gender: res.data.user.gender || "",
          phone: res.data.user.phone || "",
        });

        setAddressData({
          doorNo: res.data.user.address?.doorNo || "",
          street: res.data.user.address?.street || "",
          city: res.data.user.address?.city || "",
          state: res.data.user.address?.state || "",
          pinCode: res.data.user.address?.pinCode || "",
        });

        setLoading(false);

      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  // Handle Profile Update
  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await updateUserProfile(profileData);
      const res2 = await getUserProfile();
      localStorage.setItem("user", JSON.stringify(res2.data.user));
      setUser(res.data.user);
      setEditProfileOpen(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  // Handle Address Update
  const updateAddress = async (e) => {
    e.preventDefault();

    try {
      const res = await updateUserAddress(addressData);
      toast.success("Address updated successfully");
      const res2 = await getUserProfile();
      localStorage.setItem("user", JSON.stringify(res2.data.user));
      setUser(res2.data.user);
      setEditAddressOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };
  // Handle Delete Account
  const deleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account permanently?")) {
      try {
        await deleteUserAccount();

        toast.warning("Account deleted successfully");
        logout();

      } catch (err) {
        console.log(err);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

 return (
  <div className="max-w-3xl mx-auto mt-10 p-6">

    <h2 className="text-3xl font-bold mb-6">Profile</h2>

    {/* Profile Card */}
    <div className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200">
      <p className="text-lg"><strong>Name:</strong> {user.name}</p>
      <p className="text-lg"><strong>Email:</strong> {user.email}</p>
      <p className="text-lg"><strong>Phone:</strong> {user.phone || "Not added"}</p>
      <p className="text-lg"><strong>Gender:</strong> {user.gender || "Not added"}</p>

      <button
        onClick={() => setEditProfileOpen(!editProfileOpen)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        {editProfileOpen ? "Close Edit Profile" : "Edit Profile"}
      </button>
    </div>

    {/* Edit Profile Form */}
    {editProfileOpen && (
      <form
        onSubmit={updateProfile}
        className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200"
      >
        <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>

        <input
          type="text"
          placeholder="Name"
          value={profileData.name}
          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          className="border p-2 rounded-md w-full mb-3"
        />

        <select
          value={profileData.gender}
          onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
          className="border p-2 rounded-md w-full mb-3"
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>

        <input
          type="number"
          placeholder="Phone"
          value={profileData.phone}
          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
          className="border p-2 rounded-md w-full mb-3"
        />

        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Save Changes
        </button>
      </form>
    )}

    <hr className="my-8" />

    <h3 className="text-2xl font-semibold mb-4">Address</h3>

    {/* Address Card */}
    <div className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200">
      <p className="text-lg"><strong>Door No:</strong> {user.address?.doorNo || "--"}</p>
      <p className="text-lg"><strong>Street:</strong> {user.address?.street || "--"}</p>
      <p className="text-lg"><strong>City:</strong> {user.address?.city || "--"}</p>
      <p className="text-lg"><strong>State:</strong> {user.address?.state || "--"}</p>
      <p className="text-lg"><strong>PinCode:</strong> {user.address?.pinCode || "--"}</p>

      <button
        onClick={() => setEditAddressOpen(!editAddressOpen)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        {editAddressOpen ? "Close Edit Address" : "Edit Address"}
      </button>
    </div>

    {/* Edit Address Form */}
    {editAddressOpen && (
      <form
        onSubmit={updateAddress}
        className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200"
      >
        <h3 className="text-xl font-semibold mb-4">Edit Address</h3>

        <input
          type="text"
          placeholder="Door No"
          value={addressData.doorNo}
          onChange={(e) => setAddressData({ ...addressData, doorNo: e.target.value })}
          className="border p-2 rounded-md w-full mb-3"
        />

        <input
          type="text"
          placeholder="Street"
          value={addressData.street}
          onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
          className="border p-2 rounded-md w-full mb-3"
        />

        <input
          type="text"
          placeholder="City"
          value={addressData.city}
          onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
          className="border p-2 rounded-md w-full mb-3"
        />

        <input
          type="text"
          placeholder="State"
          value={addressData.state}
          onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
          className="border p-2 rounded-md w-full mb-3"
        />

        <input
          type="text"
          placeholder="PinCode"
          value={addressData.pinCode}
          onChange={(e) => setAddressData({ ...addressData, pinCode: e.target.value })}
          className="border p-2 rounded-md w-full mb-3"
        />

        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Update Address
        </button>
      </form>
    )}

    <hr className="my-8" />

    <div className="flex gap-4">
      <button
        onClick={deleteAccount}
        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
      >
        Delete Account
      </button>

      <button
        onClick={logout}
        className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 transition"
      >
        Logout
      </button>
    </div>

  </div>
);

};

export default Profile;
