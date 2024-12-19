import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Button,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { addToCart } from "../database";

export default function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };
1
  if (loading) {
    return <ActivityIndicator size="large" color="#8000ff" />;
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Button
            title="Добавить в корзину"
            onPress={() => handleAddToCart(item)}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#666",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 8,
  },
  price: {
    fontSize: 15,
    color: "#8000ff",
    marginBottom: 8,
  },
});
