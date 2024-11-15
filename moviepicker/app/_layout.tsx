import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import MovieList from './movieList';
import Index from './index';
import MovieDetails from './movieDetails';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MovieStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Index" component={Index} options={{ headerShown: false }} />
      <Stack.Screen name="MovieDetails" component={MovieDetails} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function RootLayout() {
  return(
      <Drawer.Navigator initialRouteName="MovieStack" >
        <Drawer.Screen name="MovieStack" component={MovieStack} options={{ headerTitle: '' }}  />
        <Drawer.Screen name="Lista" component={MovieList} options={{ headerTitle: 'Minha Lista' }}/>
      </Drawer.Navigator> 
  ) ;
}
