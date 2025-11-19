import React, { useEffect, useState } from "react";
import {
  deleteUserAccount,
  getUserProfile,
  updateUserAddress,
  updateUserProfile,
} from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const animeIcons = {
  MALE: "https://i.postimg.cc/tJ0mQf1W/anime-boy-icon.png",
  FEMALE: "https://i.postimg.cc/Sx3Cw5j9/anime-girl-icon.png",
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);

  // This controls whether the two-gender choices are visible for picking
  const [changingGender, setChangingGender] = useState(false);

  const navigate = useNavigate();

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
    doorNo: "",
  });

  // Load Profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile();
      setUser(res.data.user);

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
      setLoading(false);
    }
  };

  // ---------------- UPDATE PROFILE (form submit) ----------------
  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      await updateUserProfile(profileData); // your existing API
      toast.success("Profile updated!");
      fetchProfile();
      setEditProfileOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile");
    }
  };

  // ---------------- UPDATE ADDRESS ----------------
  const updateAddress = async (e) => {
    e.preventDefault();

    try {
      await updateUserAddress(addressData);
      toast.success("Address updated!");
      fetchProfile();
      setEditAddressOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update address");
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  // ---------------- DELETE ACCOUNT ----------------
  const deleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account permanently?")) {
      try {
        await deleteUserAccount();
        toast.warning("Account deleted!");
        logout();
      } catch (err) {
        console.log(err);
        toast.error("Failed to delete account");
      }
    }
  };

  // ---------------- GENDER SELECTION HANDLER ----------------
  // This uses your existing updateUserProfile API to save the gender immediately.
  const handleGenderSelect = async (genderValue) => {
    try {
      // prepare payload — base it on profileData (so other profile fields remain intact)
      const payload = { ...profileData, gender: genderValue };

      // call your existing update API
      await updateUserProfile(payload);

      // update local states and UI
      setProfileData(payload);
      setChangingGender(false);

      // refresh from server to reflect canonical state
      await fetchProfile();

      toast.success("Gender updated");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update gender");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-20 p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Profile</h2>

      {/* --- TOP CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PERSONAL INFO CARD */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Personal Info</h3>

          {/* Gender Anime Icon */}
          <div className="flex items-center gap-4 mb-4">
            {/* If user already has a gender and not actively changing, show selected avatar + edit button */}
            {user.gender && !changingGender ? (
              <div className="relative flex items-center gap-4">

                {/* GENDER IMAGE */}
                <img
                  src={animeIcons[user.gender]}
                  alt="gender icon"
                  className="w-24 h-24 rounded-full border-gray-400 border-blue-500 shadow-lg cursor-pointer"
                  onClick={() => setChangingGender(true)}
                />

                {/* EDIT ICON ON IMAGE */}
                <div
                  onClick={() => setChangingGender(true)}
                  className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z"
                    />
                  </svg>
                </div>

              </div>

            ) : (
              // Either user has no gender yet OR is changing — show both options that update immediately on click
              <div className="flex items-center gap-6">
                <div
                  className="cursor-pointer text-center"
                  onClick={() => handleGenderSelect("MALE")}
                >
                  <img
                    src={animeIcons.MALE}
                    className="w-20 h-20 rounded-full border-gray-400  hover:border-blue-600 hover:shadow-xl transition"
                    alt="boy"
                  />
                  <p className="mt-2">Boy</p>
                </div>
                     or
                <div
                  className="cursor-pointer text-center"
                  onClick={() => handleGenderSelect("FEMALE")}
                >
                  <img
                    src={animeIcons.FEMALE}
                    className="w-20 h-20 rounded-full border-gray-400 hover:border-pink-600 hover:shadow-xl transition"
                    alt="girl"
                  />
                  <p className="mt-2">Girl</p>
                </div>
              </div>
            )}
          </div>

          <p className="text-lg"><strong>Name:</strong> {user.name}</p>
          <p className="text-lg"><strong>Email:</strong> {user.email}</p>
          <p className="text-lg"><strong>Phone:</strong> {user.phone || "Not added"}</p>
          <p className="text-lg"><strong>Gender:</strong> {user.gender || "Not selected"}</p>

          <button
            onClick={() => setEditProfileOpen(!editProfileOpen)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
          >
            {editProfileOpen ? "Close Edit Profile" : "Edit Profile"}
          </button>
        </div>

        {/* ADDRESS CARD */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Address Info</h3>

          <p className="text-lg"><strong>Door No:</strong> {user.address?.doorNo || "--"}</p>
          <p className="text-lg"><strong>Street:</strong> {user.address?.street || "--"}</p>
          <p className="text-lg"><strong>City:</strong> {user.address?.city || "--"}</p>
          <p className="text-lg"><strong>State:</strong> {user.address?.state || "--"}</p>
          <p className="text-lg"><strong>PinCode:</strong> {user.address?.pinCode || "--"}</p>

          <button
            onClick={() => setEditAddressOpen(!editAddressOpen)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full"
          >
            {editAddressOpen ? "Close Edit Address" : "Edit Address"}
          </button>
        </div>
      </div>

      {/* ---------------- EDIT PROFILE FORM ---------------- */}
      {editProfileOpen && (
        <form
          onSubmit={updateProfile}
          className="mt-8 bg-white shadow-lg rounded-xl p-6 border border-gray-200"
        >
          <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              className="border p-3 rounded-lg"
              placeholder="Name"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
            />

            {/* note: gender dropdown removed — gender is handled via avatar selection */}
            <div className="flex items-center justify-center">
              <p className="text-sm text-gray-500">Gender is changed by clicking an avatar above</p>
            </div>

            <input
              type="number"
              className="border p-3 rounded-lg"
              placeholder="Phone"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData({ ...profileData, phone: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* ---------------- EDIT ADDRESS FORM ---------------- */}
      {editAddressOpen && (
        <form
          onSubmit={updateAddress}
          className="mt-8 bg-white shadow-lg rounded-xl p-6 border border-gray-200"
        >
          <h3 className="text-xl font-semibold mb-4">Edit Address</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Door No"
              className="border p-3 rounded-lg"
              value={addressData.doorNo}
              onChange={(e) =>
                setAddressData({ ...addressData, doorNo: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Street"
              className="border p-3 rounded-lg"
              value={addressData.street}
              onChange={(e) =>
                setAddressData({ ...addressData, street: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="City"
              className="border p-3 rounded-lg"
              value={addressData.city}
              onChange={(e) =>
                setAddressData({ ...addressData, city: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="State"
              className="border p-3 rounded-lg"
              value={addressData.state}
              onChange={(e) =>
                setAddressData({ ...addressData, state: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="PinCode"
              className="border p-3 rounded-lg"
              value={addressData.pinCode}
              onChange={(e) =>
                setAddressData({ ...addressData, pinCode: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full"
          >
            Update Address
          </button>
        </form>
      )}

      {/* ---------------- BOTTOM BUTTONS ---------------- */}
      <div className="flex flex-col sm:flex-row gap-4 mt-12 justify-center items-center">
        <button
          onClick={deleteAccount}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition w-full sm:w-48"
        >
          Delete Account
        </button>

        <button
          onClick={logout}
          className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition w-full sm:w-48"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
