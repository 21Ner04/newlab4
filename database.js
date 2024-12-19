import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

let db;

export const initializeDatabase = async () => {
  db = Platform.OS === "web" ? null : await SQLite.openDatabaseAsync("cart");

  await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        price REAL,
        description TEXT
      );
    `);
};

export const addToCart = async (product) => {
  const result = await db.runAsync(
    "INSERT INTO cart (title, price, description) VALUES (?, ?, ?)",
    product.title,
    product.price,
    product.description
  );

  return result;
};

export const getCartItems = async () => {
  const allRows = await db.getAllAsync("SELECT * FROM cart");
  return allRows;
};

export const clearCart = async () => {
  const result = await db.runAsync("DELETE FROM cart");
  return result;
};
