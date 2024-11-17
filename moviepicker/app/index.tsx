import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';


export default function Index() {
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState(null);
  const [streamingProviders, setStreamingProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigation = useNavigation(); 
  const apiKey = '66a35bfa766ec4ba9a40c59c2a6adae1'; 

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
          params: { api_key: apiKey, language: 'pt-BR' },
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
      }
    };
    fetchGenres();
  }, []);


  const fetchMovies = async () => {
    if (!genre) {
      alert('Por favor, escolha um gênero!');
      return;
    }
  
    let attempts = 0; // Para limitar as tentativas
    const maxAttempts = 10; // Definir um número máximo de tentativas
  
    setLoading(true);
  
    try {
      let movieFound = null;
      let providersFound = [];

      while (!movieFound && attempts < maxAttempts) {
        attempts++;
  
        const paginaAleatoria = Math.floor(Math.random() * 100) || 1; // Garante uma página válida
  
        const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
          params: {
            api_key: apiKey,
            sort_by: 'popularity.desc',
            with_genres: genre,
            language: 'pt-BR',
            page: paginaAleatoria,
            'vote_average.gte': 6,
          },
        });
  
        const movies = response.data.results.filter(
          (x) => x && x.overview && x.title
        );
  
        if (movies.length > 0) {
          const randomMovie = movies[Math.floor(Math.random() * movies.length)];
          const providersResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${randomMovie.id}/watch/providers`,
            {
              params: { api_key: apiKey, language: 'pt-BR' },
            }
          );
  
          providersFound =
            providersResponse.data.results?.BR?.flatrate || [];

          console.log("PROVIDER FOUND");
          console.log(providersFound);

          // Removendo os providers de streamings que estao disponiveis dentro da amazon e netflix básica com anuncios
          providersFound = providersFound.filter(x => x.provider_id != 1825 
            && x.provider_id != 683 
            && x.provider_id != 2157 
            && x.provider_id != 1796  
            && x.provider_id != 201
            && x.provider_id != 1853
            && x.provider_id != 582)
  
          if (providersFound.length > 0 && movieFound == null) {
            movieFound = randomMovie;
            setSelectedMovie(randomMovie);
            setStreamingProviders(providersFound);
          }

          console.log(movieFound);
          console.log(providersFound);
        }
      }
  
      if (movieFound) {
        const providerIds = providersFound.map((p) => p.provider_id).join(',');
        const providerNames = providersFound.map((p) => p.provider_name).join(',');
        const providerLogos = providersFound.map((p) => p.logo_path).join(',');
      
        console.log(providerIds);

        navigation.push('MovieDetails', {
            movieTitle: movieFound.title,
            movieAvarage: movieFound.vote_average.toFixed(2),
            overview: movieFound.overview,
            poster: movieFound.poster_path,
            providerIds,
            providerNames,
            providerLogos,
            showAddListButton: true
        });

        console.log("Deu push 1 index")
      } else {
        alert('Não foi possível encontrar um filme com provedores disponíveis após várias tentativas.');
      }
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha um gênero de filme</Text>
      <RNPickerSelect
        onValueChange={setGenre}
        items={genres.map(g => ({ label: g.name, value: g.id }))}
        placeholder={{ label: 'Selecione um gênero', value: null }}
      />
      <TouchableOpacity style={styles.button} onPress={fetchMovies}>
        <Text style={styles.buttonText}>{"SORTEAR FILME 🎲"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, textAlign: 'center' },
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
  }
});
