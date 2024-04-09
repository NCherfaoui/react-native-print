import * as React from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';


/**
 * Composant principal qui utilise les APIs pour télécharger un fichier PDF,
 * l'imprimer et enregistrer dans la galerie photos.
 */
export default function App() {
  // Liste des imprimantes connectées
  const [printers, setPrinters] = React.useState([]);
  // Imprimante sélectionnée
  const [selectedPrinter, setSelectedPrinter] = React.useState(null);

  // Télécharge un fichier PDF
  async function download2() {
    // URL du fichier à télécharger
    const fileUrl =
      'https://assets.ctfassets.net/l3l0sjr15nav/29D2yYGKlHNm0fB2YM1uW4/8e638080a0603252b1a50f35ae8762fd/Get_Started_With_Smallpdf.pdf';
    // Nom du fichier téléchargé
    const fileName = `${Date.now()}.pdf`;

    // Téléchargement vers le stockage temporaire d'Expo
    FileSystem.downloadAsync(fileUrl, FileSystem.documentDirectory + fileName)
      .then(({ uri }) => {
        // Affichage du message de fin du téléchargement
        console.log('Fin du téléchargement vers ', uri);
        // Impression du fichier PDF
        printFile(uri);
      })
      .catch((error) => {
        // Affichage du message d'erreur
        console.error(error);
      });
  }

  // Impression d'un fichier PDF
  async function printFile(filePath) {
    // Si aucune imprimante n'est sélectionnée
    if (!selectedPrinter) {
      // Affichage d'un message dans la console
      console.log('Aucune imprimante sélectionnée');
      // Annulation de la fonction
      return;
    }
    try {
      // Lancement de l'opération d'impression
      await Print.printToFileAsync({
        // Fichier PDF à imprimer
        uri: filePath,
        // Imprimante à utiliser
        printer: selectedPrinter,
      });
    } catch (e) {
      // Affichage du message d'erreur
      console.error('Print.printToFileAsync failed', e);
    }
  }

  // Récupération des imprimantes connectées
  async function getPrinters() {
    // Récupération de la liste des imprimantes connectées
    const printers = await Print.selectPrinterAsync() || await Print.getPrintersAsync();
    console.log('imprimantes', printers);
    // Mise à jour de l'état de la liste d'imprimantes
    setPrinters(printers);
    // Affichage des informations dans la console
    console.log('imprimantes', Print);
    // Sélection de la première imprimante de la liste
    setSelectedPrinter(printers[0]);
  }

  // Exécution de la fonction de récupération d'imprimantes lors du rendu initial du composant
  React.useEffect(() => {
    getPrinters();
  }, []);

  // Composant permettant de sélectionner une imprimante
  const printerPicker = (
    <Picker selectedValue={selectedPrinter} onValueChange={(itemValue, itemIndex) => setSelectedPrinter(itemValue)}>
      {/* itération sur la liste des imprimantes */}
      {printers.map((printer) => (
        // Création d'un élément de sélection pour chaque imprimante
        <Picker.Item key={printer.name} label={printer.name} value={printer.name} />
      ))}
    </Picker>
  );

  return (
    <View style={styles.container}>
      <Button title="Sélectionner une imprimante" onPress={() => console.log('Imprimante sélectionnée', selectedPrinter)}>
        {/* Affichage du composant de sélection d'imprimante */}
        {printerPicker}
      </Button>
      <Button title="Télécharger la facture & imprimer" onPress={download2}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

