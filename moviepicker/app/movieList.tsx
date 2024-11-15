import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Para recarregar quando a tela ganhar foco

export default function MovieList({ navigation }) {
  const [movieList, setMovieList] = useState([]);

  // Função para recarregar a lista de filmes
  const loadMovies = async () => {
    const storedList = await AsyncStorage.getItem('@movieList');
    if (storedList) {
      setMovieList(JSON.parse(storedList));
    }
  };

  // Função para excluir um filme da lista
  const handleDelete = async (movieTitle) => {
    const updatedList = movieList.filter(item => item.title !== movieTitle);
    await AsyncStorage.setItem('@movieList', JSON.stringify(updatedList));
    setMovieList(updatedList);
  };

  // Usar o useFocusEffect para recarregar a lista toda vez que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadMovies();
    }, [])
  );

  return (
    <View style={styles.container}>
        <FlatList
          data={movieList}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <View style={styles.movieItem}>
              {item.poster && (
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster}` }}
                  style={styles.posterImage}
                />
              )}
              <View style={styles.movieDetails}>
                <Text style={styles.movieTitle}>{item.title}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.title)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  noMovies: { fontSize: 18, textAlign: 'center', color: 'gray' },
  movieItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  posterImage: { width: 50, height: 75, borderRadius: 5, marginRight: 15 },
  movieDetails: { flex: 1 },
  movieTitle: { fontSize: 18, fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#E53935', padding: 8, borderRadius: 5, marginTop: 5 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 18 },
});
