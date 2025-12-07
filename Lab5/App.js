import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import AddServiceScreen from "./src/screens/AddServiceScreen";
import ServiceDetailScreen from "./src/screens/ServiceDetailScreen";
import EditServiceScreen from "./src/screens/EditServiceScreen";
import MainTab from "./src/screens/MainTab";
import AddCustomerScreen from "./src/screens/AddCustomerScreen";
import TransactionDetailScreen from "./src/screens/TransactionDetailScreen";
import CustomerDetailScreen from "./src/screens/CustomerDetailScreen";
import EditCustomerScreen from "./src/screens/EditCustomerScreen";
import AddTransactionScreen from "./src/screens/AddTransactionScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="MainTab" component={MainTab}/>
        <Stack.Screen name="AddService" component={AddServiceScreen} />
        <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
        <Stack.Screen name="EditService" component={EditServiceScreen} />
        <Stack.Screen name="AddCustomer" component={AddCustomerScreen} />
        <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
        <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
        <Stack.Screen name="EditCustomer" component={EditCustomerScreen} />
        <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}