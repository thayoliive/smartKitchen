import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    StatusBar,
    ScrollView,
    ActivityIndicator,
    Alert,
    Keyboard,
  } from "react-native";
  import { MaterialCommunityIcons } from "@expo/vector-icons";
  import { useState } from "react";
  import { GoogleGenerativeAI } from "@google/generative-ai";
  
  const alturaStatusBar = StatusBar.currentHeight;
  const KEY_GEMINI = "AIzaSyA16M0ECzOOMISMce5lG3_WgxJWJI46NBo"; // Substitua pela sua chave de API
  
  const genAI = new GoogleGenerativeAI(KEY_GEMINI);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 500,
    responseMimeType: "text/plain",
  };
  
  export default function App() {
    const [load, setLoad] = useState(false);
    const [look, setLook] = useState("");
    const [roupa1, setRoupa1] = useState("");
    const [roupa2, setRoupa2] = useState("");
    const [roupa3, setRoupa3] = useState("");
    const [roupa4, setRoupa4] = useState("");
    const [temp, setTemp] = useState("");
    const [ocasiao, setOcasiao] = useState("");
  
    async function gerarLook() {
      if (
        roupa1 === "" ||
        roupa2 === "" ||
        roupa3 === "" ||
        roupa4 === "" ||
        temp === "" ||
        ocasiao === ""
      ) {
        Alert.alert("Atenção", "Informe todas as informações!", [
          { text: "Beleza" },
        ]);
        return;
      }
      setLook("");
      setLoad(true);
      Keyboard.dismiss();
  
      const prompt = `Sugira um look adequado para o ${ocasiao} usando as peças de roupa: ${roupa1}, ${roupa2}, ${roupa3} e ${roupa4} e pesquise os looks no TikTok. Caso encontre, informe o link.`;
  
      try {
        const chatSession = model.startChat({
          generationConfig,
          history: [],
        });
  
        const result = await chatSession.sendMessage(prompt);
        setLook(result.response.text());
      } catch (error) {
        console.error(error);
      } finally {
        setLoad(false);
      }
    }
  
    return (
      <View style={ESTILOS.container}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor="#F1F1F1"
        />
        <Text style={ESTILOS.header}>Armario Digital</Text>
        <View style={ESTILOS.form}>
          <Text style={ESTILOS.label}>Insira as informações:</Text>
          <TextInput
            placeholder="Peça de roupa1"
            style={ESTILOS.input}
            value={roupa1}
            onChangeText={(texto) => setRoupa1(texto)}
          />
          <TextInput
            placeholder="Peça de roupa2"
            style={ESTILOS.input}
            value={roupa2}
            onChangeText={(texto) => setRoupa2(texto)}
          />
          <TextInput
            placeholder="Peça de roupa3"
            style={ESTILOS.input}
            value={roupa3}
            onChangeText={(texto) => setRoupa3(texto)}
          />
          <TextInput
            placeholder="Peça de roupa4"
            style={ESTILOS.input}
            value={roupa4}
            onChangeText={(texto) => setRoupa4(texto)}
          />
          <TextInput
            placeholder="Temperatura"
            style={ESTILOS.input}
            value={temp}
            onChangeText={(texto) => setTemp(texto)}
          />
          <TextInput
            placeholder="Ocasião"
            style={ESTILOS.input}
            value={ocasiao}
            onChangeText={(texto) => setOcasiao(texto)}
          />
        </View>
  
        <TouchableOpacity style={ESTILOS.button} onPress={gerarLook}>
          <Text style={ESTILOS.buttonText}>Gerar Look</Text>
          <MaterialCommunityIcons name="food-variant" size={24} color="#FFF" />
        </TouchableOpacity>
  
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24, marginTop: 4 }}
          style={ESTILOS.containerScroll}
          showsVerticalScrollIndicator={false}
        >
          {load && (
            <View style={ESTILOS.content}>
              <Text style={ESTILOS.title}>Fazendo seu look...</Text>
              <ActivityIndicator color="#000" size="large" />
            </View>
          )}
  
          {look && (
            <View style={ESTILOS.content}>
              <Text style={ESTILOS.title}>Seu Look 👇</Text>
              <Text style={{ lineHeight: 24 }}>{look}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
  
  const ESTILOS = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f1f1f1",
      alignItems: "center",
      paddingTop: 20,
    },
    header: {
      fontSize: 32,
      fontWeight: "bold",
      paddingTop: Platform.OS === "android" ? alturaStatusBar : 54,
    },
    form: {
      backgroundColor: "#FFF",
      width: "90%",
      borderRadius: 8,
      padding: 16,
      marginTop: 16,
      marginBottom: 8,
    },
    label: {
      fontWeight: "bold",
      fontSize: 18,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderRadius: 4,
      borderColor: "#94a3b8",
      padding: 8,
      fontSize: 16,
      marginBottom: 16,
    },
    button: {
      backgroundColor: "blue",
      width: "90%",
      borderRadius: 8,
      flexDirection: "row",
      padding: 14,
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    buttonText: {
      fontSize: 18,
      color: "#FFF",
      fontWeight: "bold",
    },
    content: {
      backgroundColor: "#FFF",
      padding: 16,
      width: "100%",
      marginTop: 16,
      borderRadius: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 14,
    },
    containerScroll: {
      width: "90%",
      marginTop: 8,
    },
  });
  