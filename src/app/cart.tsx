import { Text, View, ScrollView, Alert, Linking } from "react-native";
import { Header } from "@/components/header";
import { Product } from "@/components/product";
import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/functions/format-currency";
import { Button } from "@/components/button";
import { LinkButton } from "@/components/link-button";
import { Feather } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Input } from "@/components/input";
import { useState } from "react";
import { useNavigation } from "expo-router";

const PHONE_NUMBER = "5519991919353";

export default function Cart() {
  const [address, setAddress] = useState("");
  const cartStore = useCartStore();
  const navigation = useNavigation();

  const total = formatCurrency(cartStore.products.reduce((total, product) => total + product.price * product.quantity, 0))

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert("Atenção", `Deseja remover ${product.title} do carrinho?`, [
      {
        text: "Cancelar"
      },
      {
        text: "Remover",
        onPress: () => cartStore.remove(product.id)
      }
    ])
  }

  function handleOrder() {
    if(address.trim().length === 0) {
      return Alert.alert("Pedido", "Informe os dados da entrega");
    }

    const products = cartStore.products.map((product) => `\n ${product.quantity}x - ${product.title}`)
                                        .join("");

    const message = `
      === Novo Pedido ===\n
      Entregar em: ${address} \n
      ${products} \n
      Valor total: ${total}
    `;
    console.log(message);

    // Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`);

    cartStore.clear();
    navigation.goBack();
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Seu carrinho" />
      <KeyboardAwareScrollView>
        <ScrollView>
          <View className="p-5 flex-1">
          {
            cartStore.products.length > 0 ?
            (
              <View className="border-b border-slate-700">
                {cartStore.products.map((product) => (
                    <Product key={product.id} data={product} onPress={() => handleProductRemove(product) } />
                ))}
              </View>
            ) : 
            (
              <Text className="font-body text-slate-400 text-center my-8">
                Seu carrinho esta vazio
              </Text>
            )
          }
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>


        <View className="flex-row gap-2 items-center mt-5 mb-4">
          <Text className="text-white text-xl font-subtitle">Total: </Text>
          <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
        </View>
        <Input placeholder="Informe o endereço de entrega" onChangeText={setAddress} />
        <View className="p5 gap-5">
          <Button onPress={handleOrder}>
            <Button.Icon>
              <Feather name="send" size={24} />
            </Button.Icon>
            <Button.Text>Finalizar Pedido</Button.Text>

          </Button>
          <LinkButton className="p-2" title="Voltar" href="/" />
        </View>
    </View>
  );
}