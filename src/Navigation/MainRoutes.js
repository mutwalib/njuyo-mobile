import {createDrawerNavigator} from '@react-navigation/drawer';
import TabRoutes from './TabRoutes';
import navigationStrings from '../consts/navigationStrings';
const Drawer = createDrawerNavigator();
const MainRoutes = () => {
  return (
    <Drawer.Navigator screenOptions={{headerShown: false}}>
      <Drawer.Screen component={TabRoutes} name={navigationStrings.TABS} />
    </Drawer.Navigator>
  );
};

export default MainRoutes;
