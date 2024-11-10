import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const Payments = () => {
  const [selectedCard, setSelectedCard] = useState(1);
  const [amount, setAmount] = useState('');

  const cards = [
    { id: 1, last4: '4242', type: 'visa' },
    { id: 2, last4: '8888', type: 'mastercard' },
  ];

  const quickAmounts = ['$10', '$20', '$50', '$100'];

  const getCardIcon = (type) => {
    switch (type) {
      case 'visa':
        return <FontAwesome name="cc-visa" size={32} color="#1A1F71" />;
      case 'mastercard':
        return <FontAwesome name="cc-mastercard" size={32} color="#EB001B" />;
      default:
        return <FontAwesome name="credit-card" size={32} color="#333" />;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment</Text>
        <TouchableOpacity style={styles.historyButton}>
          <MaterialIcons name="history" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Amount Input Section */}
      <View style={styles.amountContainer}>
        <Text style={styles.label}>Amount</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor="#999"
          />
        </View>

        {/* Quick Amount Buttons */}
        <View style={styles.quickAmounts}>
          {quickAmounts.map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={styles.quickAmountButton}
              onPress={() => setAmount(quickAmount.replace('$', ''))}
            >
              <Text style={styles.quickAmountText}>{quickAmount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.paymentMethodsContainer}>
        <Text style={styles.label}>Payment Method</Text>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.cardItem,
              selectedCard === card.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedCard(card.id)}
          >
            <View style={styles.cardIconContainer}>
              {getCardIcon(card.type)}
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.cardType}>{card.type.toUpperCase()}</Text>
              <Text style={styles.cardNumber}>•••• {card.last4}</Text>
            </View>
            <View style={styles.radioButton}>
              {selectedCard === card.id && <View style={styles.radioSelected} />}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addCardButton}>
          <MaterialCommunityIcons name="credit-card-plus" size={24} color="#007AFF" />
          <Text style={styles.addCardText}>Add New Card</Text>
        </TouchableOpacity>
      </View>

      {/* Pay Button */}
      <TouchableOpacity style={styles.payButton}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  historyButton: {
    padding: 8,
  },
  amountContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  currencySymbol: {
    fontSize: 24,
    color: '#333',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    color: '#333',
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  quickAmountButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  quickAmountText: {
    color: '#333',
    fontWeight: '500',
  },
  paymentMethodsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
  },
  selectedCard: {
    backgroundColor: '#e3efff',
  },
  cardIconContainer: {
    marginRight: 16,
  },
  cardDetails: {
    flex: 1,
  },
  cardType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  addCardText: {
    marginLeft: 8,
    color: '#007AFF',
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Payments;