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
  import { MaterialIcons } from "@expo/vector-icons";
  import { useState } from "react";
  
  const alturaStatusBar = StatusBar.currentHeight;
  
  export default function App() {
    const [load, defLoad] = useState(false);
    const [look, defLook] = useState("");
    const [roupa1, defRoupa1] = useState("");
    const [roupa2, defRoupa2] = useState("");
    const [roupa3, defRoupa3] = useState("");
    const [roupa4, defRoupa4] = useState("");
    const [temp, defTemp] = useState("");
    const [ocasiao, defOcasiao] = useState("");
  
    async function gerarLook() {
      if (
        roupa1 === "" ||
        roupa2 === "" ||
        roupa3 === "" ||
        roupa4 === "" ||
        ocasiao === ""
      ) {
        Alert.alert("Atenção", "Informe todos os ingredientes!", [
          { text: "Beleza" },
        ]);
        return;
      }
      defLook("");
      defLoad(true);
      Keyboard.dismiss();
    }
  
    const KEY_GPT = "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";
  
    const prompt = `Sugira um look adequado para o ${ocasiao} usando as peças de roupa: ${roupa1}, ${roupa2}, ${roupa3} e ${roupa4} e pesquise os looks no TikTok. Caso encontre, informe o link.`;
  
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY_GPT}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 500,
        top_p: 1,
      }),
    })
  
    
    .then(response => response.json())
    .then((data) => {
      console.log(data.choices[0].message.content);
      defLook(data.choices[0].message.content)
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      defLoad(false);
    })
  
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
            onChangeText={(texto) => defRoupa1(texto)}
          />
          <TextInput
            placeholder="Peça de roupa2"
            style={ESTILOS.input}
            value={roupa2}
            onChangeText={(texto) => defRoupa2(texto)}
          />
          <TextInput
            placeholder="Peça de roupa3"
            style={ESTILOS.input}
            value={roupa3}
            onChangeText={(texto) => defRoupa3(texto)}
          />
          <TextInput
            placeholder="Peça de roupa4"
            style={ESTILOS.input}
            value={roupa4}
            onChangeText={(texto) => defRoupa4(texto)}
          />
          <TextInput
            placeholder="Temperatura"
            style={ESTILOS.input}
            value={temp}
            onChangeText={(texto) => defTemp(texto)}
          />
          <TextInput
            placeholder="Ocasião"
            style={ESTILOS.input}
            value={ocasiao}
            onChangeText={(texto) => defOcasiao(texto)}
          />
        </View>

        <TouchableOpacity onPress={gerarLook} style={ESTILOS.button}>
          <Text style={ESTILOS.buttonText}>Gerar Look</Text>
          <MaterialIcons name="travel-explore" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={ESTILOS.containerScroll}
          contentContainerStyle={{ paddingBottom: 24, marginTop: 4 }}
        >
          {load && (
            <View style={ESTILOS.content}>
              <Text style={ESTILOS.title}>Fazendo seu look...</Text>
              <ActivityIndicator color="#000" size="large" />
            </View>
          )}
  
          {look && (
            <View style={ESTILOS.content}>
              <Text style={ESTILOS.title}>Seu look 👇</Text>
              <Text style={{ lineHeight: 24 }}>{look} </Text>
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
      backgroundColor: "#FF5656",
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
  