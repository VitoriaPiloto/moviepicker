import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams  } from 'expo-router'

const apiKey = '66a35bfa766ec4ba9a40c59c2a6adae1'; 

export default function MovieDetails() {
  const [streamingProviders, setStreamingProviders] = useState([]);
  const { movieTitle, movieAvarage, overview, poster, id } = useLocalSearchParams ();

  useEffect(() => {
    if (id) {
      fetchStreamingProviders();
    }
  }, [id]);

  const fetchStreamingProviders = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/watch/providers`, {
        params: {
          api_key: apiKey,
          language: 'pt-BR',
        },
      });

      // Filtra as plataformas de streaming
      const providers = response.data.results?.BR?.flatrate || []; // 'BR' para Brasil, pode ser alterado para outros países
      
      console.log(providers);

      setStreamingProviders(providers);
    } catch (error) {
      console.error('Erro ao buscar provedores de streaming:', error);
      alert('Erro ao carregar os provedores de streaming.');
    }
  };
  console.log(overview);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movieTitle}</Text>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${poster}` }}
        style={styles.poster}
      />
      <Text style={styles.overview}>{overview}</Text>
      <Text style={styles.rating}>Nota: {movieAvarage}</Text>
      <ScrollView>
      <Text style={styles.providersTitle}>Disponível em:</Text>
          {streamingProviders.length > 0 ? (
            <View style={styles.providersContainer}>
              {streamingProviders.map((provider) => (
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
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  providersTitle: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
  },
  providersContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  providerItem: {
    alignItems: 'center',
    margin: 10,
    width: 100,
    justifyContent: 'center',
  },
  providerLogo: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  overview: {
    fontSize: 16,
    marginBottom: 10,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});