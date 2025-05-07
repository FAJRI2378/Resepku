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
    try {
      const response = await fetch(API_ADD_FAVORITE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, menuId }),
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Gagal menambahkan favorit: ${errorMsg}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  };
  
  export const removeFavorite = async (userId, menuId) => {
    try {
      const response = await fetch(API_REMOVE_FAVORITE_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, menuId }),
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Gagal menghapus favorit: ${errorMsg}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  };
  