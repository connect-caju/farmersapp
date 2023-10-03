/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        // paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: 'ghostwhite',
    },
    headerText: {
        fontFamily: 'JosefinSans-Bold',
        fontSize: 20,
        color: '#000',
    },
    description: {
        textAlign: 'left',
        fontFamily: 'JosefinSans-Regular',
        paddingVertical: 10,
        color: 'grey',
        fontSize: 14,
    },
    secondDescription: {
        textAlign: 'center',
        fontFamily: 'JosefinSans-Italic',
         color: '#005000',
        fontSize: 18,
        lineHeight: 30,
    },
    formSectionDescription: {
        textAlign: 'center',
        fontFamily: 'JosefinSans-Italic',
        color: '#005000',
        fontSize: 16,
        paddingVertical: 10,
    },
    datepicker: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#A8A8A8',
        minHeight: 55,
        // backgroundColor: 'ghostwhite',
        // color: 'grey',
    },
});

export default styles;
