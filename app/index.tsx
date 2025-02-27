import { View } from "react-native";
import Login from "./pages/login";
import { FormProvider } from "./context/FormContext";
import './i8n/i8n.congif'
export default function Index() {
  return (
    <FormProvider>
      <View style={{ flex: 1 }}>
        <Login />
      </View>
    </FormProvider>
  );
}
