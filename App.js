import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Animated,
    AsyncStorage,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";

const STORAGE_KEY_TODOS = "@toDos";
const STORAGE_KEY_WORKING = "@working";

const App = () => {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});

    useEffect(async () => {
        loadToDos();
    }, []);

    const work = () => setWorking(true);
    const travel = () => setWorking(false);

    const addToDo = async () => {
        if (text === "") {
            return;
        }
        const newToDos = {
            ...toDos,
            [Date.now()]: { text, working, complete: false },
        };
        setToDos(newToDos);
        setText("");
        await saveToDos(newToDos);
    };

    const saveWorking = async (save) => {
        await AsyncStorage.setItem(STORAGE_KEY_WORKING, save ? 0 : 1);
    };

    const saveToDos = async (save) => {
        await AsyncStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(save));
    };

    const loadToDos = async () => {
        try {
            const value = await AsyncStorage.getItem(STORAGE_KEY_TODOS);
            if (value !== null) {
                setToDos(JSON.parse(value));
            }
        } catch (error) {
            // Error retrieving data
            console.log(error);
        }
    };

    const renderRightActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [50, 70, 90, 100],
        });
        return (
            <Animated.View
                style={{ flex: 1, transform: [{ translateX: trans }] }}
            >
                <RectButton style={{ backgroundColor: "red" }}>
                    <Text>Archive</Text>
                </RectButton>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text
                        style={{
                            ...styles.headerText,
                            color: working ? "#fff" : "#aaa",
                        }}
                    >
                        Work
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={travel}>
                    <Text
                        style={{
                            ...styles.headerText,
                            color: !working ? "#fff" : "#777",
                        }}
                    >
                        Travel
                    </Text>
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.textInput}
                placeholder={
                    working
                        ? "What do you have to do?"
                        : "Where do you wanna go?"
                }
                returnKeyType="done"
                onChangeText={(text) => {
                    setText(text);
                }}
                value={text}
                onSubmitEditing={addToDo}
            ></TextInput>
            <ScrollView style={styles.toDos}>
                {Object.keys(toDos).map((key) =>
                    toDos[key].working == working ? (
                        <Swipeable
                            key={key}
                            renderRightActions={renderRightActions}
                        >
                            <View style={styles.toDo}>
                                <Text style={styles.toDoText}>
                                    {toDos[key].text}
                                </Text>
                            </View>
                        </Swipeable>
                    ) : null
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: "black",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginTop: 50,
    },
    headerText: {
        fontSize: 40,
        fontWeight: "600",
    },
    textInput: {
        backgroundColor: "white",
        marginHorizontal: 10,
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 18,
        fontSize: 20,
        borderRadius: 25,
    },
    toDos: {
        marginTop: 30,
    },
    toDo: {
        backgroundColor: "rgba(200,200,200,0.3)",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 20,
        marginBottom: 15,
    },
    toDoText: {
        color: "white",
        fontSize: 20,
    },
});

export default App;
