import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import Index from './index'; 
import MovieDetails from './movieDetails'; 
import MovieList from './movieList'; 

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MovieStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Index" 
        component={Index} 
        options={{ title: 'Sorteio de Filmes', headerShown: false }} 
      />
      <Stack.Screen 
        name="MovieDetails" 
        component={MovieDetails} 
        options={{ title: 'Detalhes do Filme', headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

function MovieListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MovieList" component={MovieList} options={{ title: 'Minha Lista', headerShown: false }} />
      <Stack.Screen name="MovieDetails" component={MovieDetails} options={{ title: 'Detalhes do Filme', headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function RootLayout() {
  return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen 
          name="Home" 
          component={MovieStack} 
          options={{ title: 'Sorteio de Filmes' }} 
        />
        <Drawer.Screen 
          name="Lista" 
          component={MovieListStack} 
          options={{ title: 'Minha Lista' }} 
        />
      </Drawer.Navigator>
  );
}
