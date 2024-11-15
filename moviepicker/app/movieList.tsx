import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function MovieList() {
  const [movieList, setMovieList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      const storedList = await AsyncStorage.getItem('@movieList');
      setMovieList(storedList ? JSON.parse(storedList) : []);
    };

    fetchMovies();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={movieList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieItem}
            onPress={() => router.push(`movieDetails?movieTitle=${item.title}`)}
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster}` }}
              style={styles.poster}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.rating}>Nota: {item.rating}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  movieItem: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  poster: { width: 50, height: 75, borderRadius: 5 },
  textContainer: { marginLeft: 10, flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold' },
  rating: { fontSize: 14, color: '#666' },
});
