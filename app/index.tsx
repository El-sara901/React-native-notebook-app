import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
export default function Index() {
   const [note, setNote] = useState("");
   const [noteslist, setNotesList] = useState<any[]>([]);
   // Zustand für die ausgewählte Hintergrundfarbe (Standard. Weiß)
   const [bgColor, setBgColor] = useState<string>("#ffffff");
   // Wustand für den Suchtext
   const [searchText, setSearchText] = useState<string>("");

   // Zustand für die ausgewählte Textfarbe(Standard: Dunkelgrau/Schwarz)
   const [textColor, setTextColor] = useState<string>("#333333");
   //Zustand für die Schriftgröße (Standard: 16)
   const [fontSize, setFontSize] = useState<number>(16);

   //Zustand für den Schriftstill (Standard: 'normal')
   const [fontStyle, setFontStyle] = useState<'normal' | 'italic' >('normal');

   const [isEditing, setIsEditing] = useState(false);
   const [editIndex, setEditIndex] = useState<number | null>(null);

   useEffect(() => {
    const loadNotes = async () => {
      try {
        const savedNotes = await AsyncStorage. getItem('@my_saved_notes');
        console.log("🔍 gefunden im Handy:", savedNotes);
        if (savedNotes !== null) {
          setNotesList(JSON.parse(savedNotes));
        }
      } catch (e) {
        console.log("❌ Error loading notes", e);
      }
    };
    loadNotes();
   },[]);

   const saveNotesToDevice = async (dataToSave: any[]) => {
    try {
      await AsyncStorage.setItem('@my_saved_notes', JSON.stringify(dataToSave));
      console.log("✅ Gespeichert in AsyncStorage:", dataToSave);
    } catch (e) {
      console.log ("❌Error saving notes to device", e);
    }
   };
   const handleAddNote = () => {
    if (note.trim() ==='') return;

    const currentDateTime = new Date().toLocaleString('fr-FR',{
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Wir erstellen ein "Notiz-Objekt" mit allen Design-Einstellungen
    const noteObject = {
      id: Date.now().toString(),
      text: note,
      backgroundColor: bgColor,
      textColor: textColor,
      fontSize: fontSize,
      fontStyle: fontStyle,
      date: currentDateTime
    };
    
    const newNotes =[...noteslist, noteObject];
    setNotesList(newNotes);
    saveNotesToDevice(newNotes);

    setNote("");
    setBgColor("#ffffff");
    setTextColor("#333333");
    setFontSize(16);
    setFontStyle('normal');
  };
  const startEditing =(index: number) =>{
    const selectedNote = noteslist[index];
    setNote(selectedNote.text);
    setBgColor(selectedNote.backgroundColor || "#ffffff");
    setTextColor(selectedNote.textColor || "#333333");
    setFontSize(selectedNote.fontSize || 16);
    setFontStyle(selectedNote.fontStyle || 'normal');
    setIsEditing(true);
    setEditIndex(index);
  };
  const handleSaveNote = ()=>{
    if(note.trim() ===""||editIndex===null)return;

    const currentDateTime = new Date().toLocaleString('fr-FR',{
      day:'2-digit',
      month:'2-digit',
      year:'numeric',
      hour:'2-digit',
      minute:'2-digit'
    });
    const updatedNotes =noteslist.map((item,index)=>
    index === editIndex
    ?{...item,text:note,backgroundColor:bgColor,textColor:textColor,fontSize:fontSize,fontStyle:fontStyle,date:currentDateTime}
    :item 
   );
   setNotesList(updatedNotes);
   saveNotesToDevice(updatedNotes);
   
   setNote("");
   setIsEditing(false);
   setEditIndex(null);
   setBgColor("#ffffff");
   setTextColor("#333333");
   setFontSize(16);
   setFontStyle('normal');
  };

   const handleDeleteNote = (indexToDelete: number) => {
    // Filtere die List und behalte nur die Notizen, deren Index nicht dem gelöschten entspricht
    const filteredNotes = noteslist.filter((_, index) => index !== indexToDelete);
    setNotesList(filteredNotes);
    saveNotesToDevice(filteredNotes);
   };

return (
   <ScrollView style={styles.container}>
     {/*🔍 Suchleiste (Search Bar) */}
  <View style={styles.searchContainer}>
    <TextInput
      style={styles.searchInput}
      placeholder="🔍 Notizen suchen..."
      placeholderTextColor="#888"
      value={searchText}
      onChangeText={(text) => setSearchText(text)}
      />
      </View>
    <Text style={styles.title}>my Notebook</Text>
    {/* Farbauswahl für den Hintergrund */}
    <Text style={styles.sectionTitle}>Hintergrundfarbe wählen:</Text>
    <View style={styles.colorRow}>
      <TouchableOpacity style={[styles.colorCircle, {backgroundColor: "#ffffff" }]} onPress={() => setBgColor("#ffffff")} />
      <TouchableOpacity style={[styles.colorCircle, {backgroundColor: "#ffe5e5" }]} onPress={() => setBgColor("#ffe5e5")} />
      <TouchableOpacity style={[styles.colorCircle, {backgroundColor: "#e5f7ff" }]} onPress={() => setBgColor("#e5f7ff")} />
      <TouchableOpacity style={[styles.colorCircle, {backgroundColor: "#fef7d1" }]} onPress={() => setBgColor("#fef7d1")} />
    </View>
    {/* Schriftgröße und Still anpassen */}
    <Text style={styles.sectionTitle}>Schriftart anpassen:</Text>
    <View style={styles.fontRow}>
    {/* Buttons für die Schriftgröße */}
    <TouchableOpacity style={styles.fontButton} onPress={() => setFontSize(14)}>
      <Text style={styles.fontButtonText}>A-</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.fontButton} onPress={() => setFontSize(18)}>
      <Text style={styles.fontButtonText}>A</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.fontButton} onPress={() => setFontSize(24)}>
      <Text style={styles.fontButtonText}>A+</Text>
    </TouchableOpacity>

    {/* Trennlinie zwischen Größe und Still */}
    <View style={styles.divider} />
    <TouchableOpacity
      style={[styles.fontButton, fontStyle === 'italic' && styles.activeFontButton]}
      onPress={() => setFontStyle(fontStyle === 'normal' ? 'italic' : 'normal')}
      >
      <Text style={[styles.fontButtonText, { fontStyle: 'italic'}]}>I</Text>
      </TouchableOpacity>
      </View>
      
    <TextInput
      style={[
        styles.input, 
        {
          backgroundColor: bgColor,
          color: textColor,
          fontSize: fontSize,
          fontStyle: fontStyle,
          }
        ]}
      placeholder="my day"
      placeholderTextColor="#999"
      multiline={true}
      value={note}
      onChangeText={(text) => setNote(text)}
      />
      {/* Button zum Speichern der Notiz */}
      <TouchableOpacity style={[styles.button, isEditing && { backgroundColor: '#2ecc71'}]} onPress={isEditing ? handleSaveNote : handleAddNote}>
        <Text style={styles.buttonText}>{isEditing ?"Notiz bearbeiten 📝": "Save Note 💾"}</Text>
      </TouchableOpacity>
      {/* Liste der gespeicherten Notizen anzeigen */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>My Saved Notes:</Text>
        
        {noteslist.length === 0 ? (
          <Text style={styles.emptyText}>No notes saved yet...</Text>
        ) : (
          noteslist
          .filter(item => item && item.text && item.text.toLowerCase().includes(searchText.toLowerCase()))
          .map((item, index) => (
            <View 
              key={index}
              // werden wir das gespeicherte Hintergrnddesign an:
              style={[styles.noteItem, { backgroundColor: item.backgroundColor}]}
              >
            <TouchableOpacity     
             style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start'}}
             onPress={() => startEditing(index)}
             >
              {/* wenden wir die gespeicherte Schriftgröße, Farbe und den Stil an: */}
              <Text
               style={[
                {
                  color: item.textColor,
                  fontSize: item.fontSize,
                  fontStyle: item.fontStyle
                }
              ]}
              >
                {item.text}
              </Text>
              <Text style={styles.dateText}>
                {item.date}
              </Text>
            </TouchableOpacity>

               {/* Löchen-Button */}
              <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteNote(index)}
              >
                {/*Hier muss der Text mit dem Emoji stehen*/}
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    <View style={styles.previewContainer}>
      <Text style={styles.previewTitle}>Vorschau:</Text>
      <Text style={styles.previewText}>{note || "Empty.."}</Text>
    </View>
  </ScrollView>
 );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 150,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  previewContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#eef2f7",
    borderRadius: 10,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  previewText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    marginTop: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
  },
  noteItem: {
    // Entfernen Sie die feste Hintergrundfarbe,damit das Design dynamisch geleden wird!
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#ffe5e5", //Eine sanft, hellrote Hintergrundfarbe für den Löchen-Button
    padding: 8, //Innenabstand, damit man den Button leichter mit dem Finger trifft
    borderRadius: 8, // Abgerundete Ecken für ein modernes Design
    borderWidth: 1, //Ein sehr dünner Rahmen um den Button
    borderColor: "#ffb3b3", // Die Rahmenfarbe passt harmonisch zum hellroten Hintergrund
  },
  deleteButtonText: {
    fontSize: 18,
  },
  // Titel für den Farbauswahl-Bereich
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#555",
  },
  colorRow: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  colorCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  // Reihe für die Schriftart-Optionen
  fontRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  // Einzelner Knopf für die Schrftoptionen
  fontButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  // Aktiver Knopf für den kursiven Stil ( wenn ausgewählt)
  activeFontButton: {
    backgroundColor: "#4a90e2",
  },
  // Text auf den Knöpfen
  fontButtonText: {
    fontWeight: "bold",
    fontSize: 14,
    color:"#333",
  },
  // Eine vertikale Trennlinie
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  // Container für die Suchleiste
  searchContainer: {
    marginBottom: 20,
  },
  // Das Eingabefeld für die Suche
  searchInput: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  dateText: {
    fontSize: 11,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
});
