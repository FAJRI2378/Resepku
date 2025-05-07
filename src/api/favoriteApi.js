import {
    API_ADD_FAVORITE_URL,
    API_REMOVE_FAVORITE_URL,
    API_GET_FAVORITES_URL,
  } from "../config/config";
  
  export const getUserFavorites = async (userId) => {
    const response = await fetch(API_GET_FAVORITES_URL(userId));
    if (!response.ok) throw new Error("Gagal mengambil data favorit");
    return response.json();
  };
  
  export const addFavorite = async (userId, menuId) => {
    const response = await fetch(API_ADD_FAVORITE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, menuId }),
    });
    if (!response.ok) throw new Error("Gagal menambahkan favorit");
    return response.json();
  };
  
  export const removeFavorite = async (userId, menuId) => {
    const response = await fetch(API_REMOVE_FAVORITE_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, menuId }),
    });
    if (!response.ok) throw new Error("Gagal menghapus favorit");
    return response.json();
  };
  
  
  