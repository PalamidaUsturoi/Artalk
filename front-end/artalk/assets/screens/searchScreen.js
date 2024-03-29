import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, View, Text } from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { Avatar, Caption, Title } from "react-native-paper";
import { useLinkTo } from "@react-navigation/native";

const Item = ( {user, onPress} ) => {
    const { ipString } = useContext( EnvContext );
    
    //console.log( user );

    return (
        <TouchableOpacity style = {styles.LogoBanner} onPress = {onPress}>
            <View style = {{flexDirection: "row", alignContent: "center"}}>
                <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + user.image}} size = {50} />
                <View>
                    <Title style = {{fontSize: 20, fontWeight: "bold", margin: 5, color: "#fff"}}>{user.name} {user.surname}</Title>
                    <Caption style = {{margin: 5, fontSize: 15, bottom: 5, color: "#fff"}}>@{user.username}</Caption>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function SearchScreen( {navigation} ) {
    const { ipString } = useContext( EnvContext );
    const [data, setData] = useState( [] );
    
    const getSearchedUser = async( searchedString ) => {
        if ( !searchedString ) {
            setData([]);
            return;
        } 
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, searchedString: searchedString} )
        };
    
        await fetch( ipString + "api/user/getSearchedUsers", options )
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    useEffect( () => {
        setData( [] );
    },[]);

    const linkTo = useLinkTo();
    const renderItem = ( {item} ) => {
        const onPress = () => {
            linkTo("/profile/" + item._id);
        };
        return (
            <Item onPress = {() => onPress()} user = {item} />
        );
    };

    //console.log( data );

    return (
        <SafeAreaView style = {{flex: 1, backgroundColor: "#111", alignItems: "center"}} >
            <View style = {styles.LogoBannerView}>
                <View style={{flex: 1}}>
                    <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}} style = {{marginLeft: 20}}>
                        <Octicons name="three-bars" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <Text style = {{color: "#fff", fontSize: 25, marginLeft: -35}}>Search</Text>
                </View>
            </View>
            <View style = {{backgroundColor: "#fff", height: 1}}/>
            <View style = {styles.SearchView}>
                {/* <TouchableOpacity style = {styles.BackBtn} onPress = { () => {navigation.goBack(null)} } >
                    <Ionicons style = {{alignSelf: "center"}} name = "chevron-back" size = {24} color = "#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}} style = {{marginLeft: 15}}>
                    <Octicons name="three-bars" size={24} color="#fff"/>
                </TouchableOpacity> */}
                <View style = {styles.TextInputContainer}>
                    <TextInput style = {styles.TextInput} placeholder = {"Who are you looking for?"} placeholderTextColor = "#fff" onChangeText = { ( text ) => getSearchedUser( text ) } />
                </View>
            </View>
            <FlatList 
                data = {data}
                renderItem = {renderItem}
                keyExtractor = {item => item._id}
                extraData = {data}
                scrollEnabled = {true}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    TextInputContainer: {
        // flex: 1,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        height: 50,
        width: '85%',
        margin: 5,
        justifyContent: "center"
    },
    TextInput: {
        height: 50,
        //flex: 1,
        padding: 10,
        //margin: 5,
        // width: "85%",
        color: "#fff"
        //margin: 10
    },
    LogoBanner: {
        flexDirection: "row",
        width: "100%",
        //marginTop: 60,
        backgroundColor: "#111",
    },
    SearchView: {
        paddingTop: 15,
        flexDirection: "row",
        width: "100%",
        // marginTop: 30,
        backgroundColor: "#111",
        justifyContent: "center",
        marginBottom: 15
    },
    LogoBannerView: {
        flexDirection: "row",
        // marginTop: 60,
        // justifyContent: "center",
        width: "100%",
        paddingTop: 10,
        paddingBottom: 10,
    },
    AvatarImage: {
        alignSelf: "center",
        margin: 5
    },
    BackBtn: {
        alignSelf: "center",
        //position: "absolute",
        //right: 0,
        //backgroundColor: "#fff",
        borderRadius: 100,
        margin: 5
    }
});