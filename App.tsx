import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import _tarefa from './types/tarefa';
import Tarefa from './components/Tarefa';
import React from 'react';
import styles from './styles';

const db = SQLite.openDatabaseSync("to-do.sqlite");

export default function App() {

  const [novaTarefa, setNovaTarefa] = useState<string>('');
  const [tarefas, setTarefas] = useState<_tarefa[]>([]);

  useEffect(
    () => {
      db.execSync(`CREATE TABLE IF NOT EXISTS tarefas (
              id INTEGER PRIMARY KEY NOT NULL,
              texto VARCHAR(100),
              concluido INTEGER DEFAULT 0
        )`);
        recarregar();
    }
  , []);


  const recarregar = async () => {
    let temp : _tarefa[] = await db.getAllAsync("SELECT * FROM tarefas");
    setTarefas(temp);
  }

  const adicionar = async() => {
    if(novaTarefa == ""){
      Alert.alert("Insira um texto!");
      return;
    }

    await db.runAsync(`INSERT INTO tarefas 
      (texto) VALUES (?)`, novaTarefa);

    setNovaTarefa('');
    await recarregar();
  }

  const renderLista = () =>{
    let t = tarefas.map(t => 
            <Tarefa 
                dados={t} 
                db={db} 
                recarregar={recarregar} 
                key={t.id}/>
          );
    return t;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>TO-DO-LIST</Text>
      <TextInput style={styles.input} value={novaTarefa} onChangeText={setNovaTarefa} />
      <View style={styles.buttonAdicionar}>
        <Button 
          onPress={adicionar} 
          title="Adicionar" 
          color="#f2f2f2" 
        />
      </View>
      <View>
        {renderLista()}
      </View>
    </View>
  );
}

