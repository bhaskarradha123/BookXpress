import React, { useEffect, useState } from "react";
import { deleteUserAccount, getUserProfile, updateUserAddress, updateUserProfile } from "../api/axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

      setEditProfileOpen(false);
      toast.success("Profile updated successfully");
      setUser(res.data.user);

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
      setUser(res.data.user);
      setEditAddressOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle Delete Account
  const deleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account permanently?")) {
      try {
        await deleteUserAccount();

        toast.warning("Account deleted successfully");
        localStorage.clear();
        window.location.href = "/login";

      } catch (err) {
        console.log(err);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ width: "70%", margin: "auto", marginTop: "40px" }}>

      <h2>Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone || "Not added"}</p>
        <p><strong>Gender:</strong> {user.gender || "Not added"}</p>
        <button onClick={() => setEditProfileOpen(!editProfileOpen)}>
          {editProfileOpen ? "Close Edit Profile" : "Edit Profile"}
        </button>
      </div>

      {/* Edit Profile Form */}
      {editProfileOpen && (
        <form onSubmit={updateProfile} className="form-card">
          <h3>Edit Profile</h3>

          <input
            type="text"
            placeholder="Name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          />

          <select
            value={profileData.gender}
            onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
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
          />

          <button type="submit">Save Changes</button>
        </form>
      )}

      <hr />

      <h3>Address</h3>
      <div className="profile-card">
        <p><strong>Door No:</strong> {user.address?.doorNo || "--"}</p>
        <p><strong>Street:</strong> {user.address?.street || "--"}</p>
        <p><strong>City:</strong> {user.address?.city || "--"}</p>
        <p><strong>State:</strong> {user.address?.state || "--"}</p>
        <p><strong>Pincode:</strong> {user.address?.pinCode || "--"}</p>

        <button onClick={() => setEditAddressOpen(!editAddressOpen)}>
          {editAddressOpen ? "Close Edit Address" : "Edit Address"}
        </button>
      </div>

      {/* Edit Address Form */}
      {editAddressOpen && (
        <form onSubmit={updateAddress} className="form-card">
          <h3>Edit Address</h3>


           <input
            type="text"
            placeholder="Door No"
            value={addressData.doorNo}
            onChange={(e) => setAddressData({ ...addressData, doorNo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Street"
            value={addressData.street}
            onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
          />
         

          <input
            type="text"
            placeholder="City"
            value={addressData.city}
            onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
          />

          <input
            type="text"
            placeholder="State"
            value={addressData.state}
            onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
          />

          <input
            type="text"
            placeholder="Pincode"
            value={addressData.pinCode}
            onChange={(e) => setAddressData({ ...addressData, pinCode: e.target.value })}
          />

          <button type="submit">Update Address</button>
        </form>
      )}

      <hr />

      <button
        style={{ marginTop: "20px", background: "red", color: "white", padding: "10px 20px" }}
        onClick={deleteAccount}
      >
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
