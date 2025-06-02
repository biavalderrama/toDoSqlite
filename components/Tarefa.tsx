import { SQLiteDatabase } from "expo-sqlite"
import _tarefa from "../types/tarefa"
import { Button, Text, View } from "react-native"
import React from "react"
import styles from '../styles';

type _propsTarefa = {
    dados: _tarefa,
    db: SQLiteDatabase,
    recarregar: any
}

export default function Tarefa(props: _propsTarefa) {

    const concluir = async()=>{
        await props.db.runAsync("UPDATE tarefas SET concluido=1 WHERE id=?", props.dados.id);
        await props.recarregar();
    }

    const excluir = async()=>{
        await props.db.runAsync("DELETE FROM tarefas WHERE id=?", props.dados.id);
        await props.recarregar();
    }

    const renderStatus = () => {
        if (props.dados.concluido) {
            return <Text style={styles.texto}> - Concluído!</Text>;
        }
        return (
            <View style={styles.buttonConcluir}>
                <Button title="Concluir" onPress={concluir} color="#f2f2f2"  />
            </View>
        );
        };

        return (
        <View style={styles.containerTarefa}>
            <Text style={styles.textoTarefa}>{props.dados.texto}</Text>
            {renderStatus()} 
            <View style={styles.buttonExcluir}>
                <Button title="Excluir" onPress={excluir} color="#f2f2f2" />
            </View>
        </View>
        );
}