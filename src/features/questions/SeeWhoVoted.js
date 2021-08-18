/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, SafeAreaView, SectionList } from 'react-native'
import {
    AppText,
    Layout
} from 'components'
import { Dimensions, FontSize, Colors } from 'constants'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import RNUxcam from 'react-native-ux-cam'
RNUxcam.tagScreenName('See Who Voted Modal')

const styles = StyleSheet.create({
    container: {
      height: Dimensions.Height,
      width: Dimensions.Width,
      flex: 1,
      top: -20
    },
})

const SeeWhoVoted = ({ route }) => {
    const contacts = useSelector((state) => state.contacts.data)

    const { receivers, groupNames, facebookGroupNames, votes } = route.params
    const [data, setData] = useState([])

    useEffect(() => {
        const myContacts = receivers.map(r => contacts.find(c => c.phoneNumber === r)).filter(r => r !== null || r !== undefined)
        const data = []

        let temp
        if(myContacts.length > 0) {
            temp = { title: 'My Contacts', data: [] }
            temp.data = myContacts.filter(c => !!votes.find(v => v.userPhoneNumber === c.phoneNumber) )
            if(temp.data.length > 0) data.push(temp)
        }
        if(groupNames.length > 0) {
            groupNames.forEach(group => {
                temp = { title: `${group.name}`, data: [] }
                temp.data = group.members.filter(m => !!votes.find(v => v.userPhoneNumber === m.phoneNumber) )
                if(temp.data.length > 0) data.push(temp)
            })
        }
        // if(facebookGroupNames.length > 0) data.push({ title: 'My Facebook Groups', data: facebookGroupNames })

        setData(data)
    }, [])

    const Item = ({ item }) => (
        <AppText
            weight="normal"
            color={Colors.purpleText}
            style={{ marginBottom: 5 }}
        >
            {item.name}
        </AppText>
    )

    return (
        <Layout>
            <SafeAreaView style={styles.container}>
                <SectionList
                    sections={data}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item item={item}/>}
                    renderSectionHeader={({ section: { title } }) => (
                      <AppText
                        weight="medium"
                        color={Colors.purpleText}
                        fontSize={FontSize.xxxLarge}
                        style={{
                            marginBottom: 15,
                            backgroundColor: Colors.background,
                            marginTop: 15
                        }}
                      >
                          {title}
                      </AppText>
                    )}
                    style={{ paddingHorizontal: 20 }}
                />
            </SafeAreaView>
        </Layout>
    )
}

SeeWhoVoted.propTypes = {
    route: PropTypes.object
}

export default SeeWhoVoted