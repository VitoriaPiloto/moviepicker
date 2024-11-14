import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter } from 'expo-router';

export default function Index() {
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const router = useRouter();
  const apiKey = '66a35bfa766ec4ba9a40c59c2a6adae1'; 

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
          params: { api_key: apiKey, language: 'pt' },
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

    var paginaAleatoria = Math.floor(Math.random() * 100);

    if (paginaAleatoria == 0)
      var paginaAleatoria = Math.floor(Math.random() * 10);

    console.log(paginaAleatoria);

    setLoading(true);
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          api_key: apiKey,
          sort_by: 'popularity.desc',
          sort_by: 'vote_avarage.desc',
          with_genres: genre,
          language: 'pt',
          page: paginaAleatoria,
          'vote_average.gte': 7,
        },
      });
      const movies = response.data.results.filter(x => x.overview != "" && x.title != undefined && x.title != null);
      var randomMovie = movies[Math.floor(Math.random() * movies.length)];

      console.log(randomMovie);

      setSelectedMovie(randomMovie);
      
      router.push({
        pathname: 'movieDetails',
        params: { 
          movieTitle: randomMovie.title, 
          movieAvarage: randomMovie.vote_average.toFixed(2), 
          overview: randomMovie.overview,
          poster: randomMovie.poster_path,
          id: randomMovie.id
        }
      });

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
      <Button title="Sortear Filme" onPress={fetchMovies} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, textAlign: 'center' },
});
