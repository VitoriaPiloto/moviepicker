import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Para navegação
import { useFocusEffect } from '@react-navigation/native'; // Para recarregar quando a tela ganha foco

export default function MovieDetails({ route }) {
  const {
    movieTitle = 'Título não disponível',
    movieAvarage = 'N/A',
    overview = 'Descrição não disponível',
    poster = null,
    providerIds = '',
    providerNames = '',
    providerLogos = '',
  } = route.params;

  const navigation = useNavigation();

  const [movieList, setMovieList] = useState([]);

  // Reconstruir os arrays
  const ids = providerIds.split(',');
  const names = providerNames.split(',');
  const logos = providerLogos.split(',');

  // Combinar os arrays em objetos
  const providers = ids.map((id, index) => ({
    provider_id: id,
    provider_name: names[index],
    logo_path: logos[index],
  }));

  // Função para recarregar a lista de filmes
  const loadMovies = async () => {
    const storedList = await AsyncStorage.getItem('@movieList');
    if (storedList) {
      setMovieList(JSON.parse(storedList));
    }
  };

  // Usar o useFocusEffect para recarregar a lista toda vez que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadMovies();
    }, [])
  );

  const handleAddToList = async () => {
    try {
      const movie = {
        title: movieTitle,
        rating: movieAvarage,
        overview,
        poster,
      };

      // Verifica se o filme já está na lista
      const existingMovie = movieList.find(item => item.title === movieTitle);
      if (existingMovie) {
        Alert.alert('Aviso', 'Este filme já está na lista.');
        return;
      }

      const updatedList = [...movieList, movie];
      await AsyncStorage.setItem('@movieList', JSON.stringify(updatedList));

      // Atualizar a lista imediatamente após adicionar o filme
      setMovieList(updatedList);

      Alert.alert('Sucesso', 'Filme adicionado à lista!');

      // Navegar de volta para a tela da lista
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o filme à lista.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>{movieTitle}</Text>
      {poster && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${poster}` }}
          style={styles.poster}
        />
      )}
      <Text style={styles.overview}>{overview}</Text>
      <Text style={styles.rating}>Nota: {movieAvarage}</Text>
      <Text style={styles.providersTitle}>Disponível em:</Text>
      {providers.length > 0 ? (
        <View style={styles.providersContainer}>
          {providers.map((provider) => (
            <View key={provider.provider_id} style={styles.providerItem}>
              {provider.logo_path && (
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${provider.logo_path}` }}
                  style={styles.providerLogo}
                />
              )}
              <Text>{provider.provider_name}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.errorText}>Não há informações sobre streaming disponíveis.</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleAddToList}>
        <Text style={styles.buttonText}>Adicionar à lista</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  button: {
    backgroundColor: '#4CAF50',
    margin: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', paddingHorizontal: 10 },
  poster: { width: 200, height: 300, borderRadius: 10, marginBottom: 20 },
  overview: { fontSize: 16, marginBottom: 10, textAlign: 'justify', lineHeight: 22 },
  rating: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  providersTitle: { fontSize: 18, marginTop: 20, fontWeight: 'bold', marginBottom: 10 },
  providersContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  providerItem: { alignItems: 'center', width: 100 },
  providerLogo: { width: 80, height: 40, resizeMode: 'contain', marginBottom: 5 },
  errorText: { textAlign: 'center', fontSize: 16, color: 'red' },
});
