import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Profile {
  date_of_birth: string;
  profile_picture: File | null;
  currency: number;
}

const API_URL = import.meta.env.VITE_API_URL;

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>({
    date_of_birth: "",
    profile_picture: null,
    currency: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/user/info/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        });
        setUser(res.data.user);
        setProfile(
            res.data.profile || { date_of_birth: "", profile_picture: null, currency: 0 },
        );
        console.log("User info fetched:", res.data);
      } catch {
        setError("Failed to fetch user information");
      } finally {
        setLoading(false);
      }

    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
          `${API_URL}/api/user/update/`,
          {
            username: user?.username,
            first_name: user?.first_name,
            last_name: user?.last_name,
            email: user?.email,
            profile: {
              date_of_birth: profile.date_of_birth,
              profile_picture: profile.profile_picture,
              currency: profile.currency, // Add currency to the payload
            },
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
            },
          },
      );
      alert("User information updated successfully");
    } catch {
      setError("Failed to update user information");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
      <div className="user-profile">
        <h1>User Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
                type="text"
                className="form-control"
                value={user?.username || ""}
                onChange={(e) => setUser({ ...user!, username: e.target.value })}
                required
            />
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input
                type="text"
                className="form-control"
                value={user?.first_name || ""}
                onChange={(e) => setUser({ ...user!, first_name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
                type="text"
                className="form-control"
                value={user?.last_name || ""}
                onChange={(e) => setUser({ ...user!, last_name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
                type="email"
                className="form-control"
                value={user?.email || ""}
                onChange={(e) => setUser({ ...user!, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
                type="date"
                className="form-control"
                value={profile.date_of_birth}
                onChange={(e) =>
                    setProfile({ ...profile, date_of_birth: e.target.value })
                }
            />
          </div>
          <div className="form-group">
            <label>Profile Picture</label>
            <input
                type="file"
                className="form-control"
                onChange={(e) =>
                    setProfile({
                      ...profile,
                      profile_picture: e.target.files?.[0] || null,
                    })
                }
            />
          </div>
          <div className="form-group">
            <label>Currency</label>
            <input
                type="number"
                className="form-control"
                value={profile.currency}
                onChange={(e) =>
                    setProfile({ ...profile, currency: parseFloat(e.target.value) })
                }
                min="0"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
  );
};

export default UserProfile;