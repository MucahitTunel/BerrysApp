import React from 'react'
import {
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'

import * as NavigationService from 'services/navigation'
import { Colors, Dimensions, Screens, FontSize } from 'constants'
import { AppIcon, AppText, ScaleTouchable, AppButton } from 'components'

const GroupListData = [
  {
    _id: 1,
    name: 'Group 1',
  },
  {
    _id: 2,
    name: 'Group 2',
  },
  {
    _id: 3,
    name: 'Group 3',
  },
  {
    _id: 4,
    name: 'Group 4',
  },
]

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.background,
    flex: 1,
  },
  groupBox: {
    padding: 16,
  },
  groupItem: {
    backgroundColor: Colors.white,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.background,
  },
  groupItemLast: {
    borderBottomWidth: 0,
  },
  creatGroupBtn: {
    position: 'absolute',
    right: 16,
    bottom: 40,
  },
})

const onPressGroupItem = (groupId) => {
  console.log('groupId', groupId)
}

const renderEmpty = () => (
  <View
    style={{
      paddingTop: 40,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <AppText style={{ textAlign: 'center' }}>There's no group yet</AppText>
  </View>
)

const goToGroupCreationScreen = () => {
  NavigationService.navigate(Screens.GroupCreation)
}

const GroupList = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <View style={styles.groupBox}>
          <AppText weight="medium" style={{ marginBottom: 16 }}>
            Group I manage
          </AppText>
          <View>
            {GroupListData.length
              ? GroupListData.map((group, index) => (
                  <ScaleTouchable
                    key={group._id}
                    style={[
                      styles.groupItem,
                      index === GroupListData.length - 1 &&
                        styles.groupItemLast,
                    ]}
                    onPress={() => onPressGroupItem(group._id)}>
                    <AppText fontSize={FontSize.normal} weight="medium">
                      {group.name}
                    </AppText>
                    <AppIcon
                      name="chevron-right"
                      size={20}
                      color={Colors.gray}
                    />
                  </ScaleTouchable>
                ))
              : renderEmpty()}
          </View>
        </View>
        <View style={styles.groupBox}>
          <AppText weight="medium" style={{ marginBottom: 16 }}>
            My Groups
          </AppText>
          <View>
            {GroupListData.length
              ? GroupListData.map((group, index) => (
                  <ScaleTouchable
                    key={group._id}
                    style={[
                      styles.groupItem,
                      index === GroupListData.length - 1 &&
                        styles.groupItemLast,
                    ]}
                    onPress={() => onPressGroupItem(group._id)}>
                    <AppText fontSize={FontSize.normal} weight="medium">
                      {group.name}
                    </AppText>
                    <AppIcon
                      name="chevron-right"
                      size={20}
                      color={Colors.gray}
                    />
                  </ScaleTouchable>
                ))
              : renderEmpty()}
          </View>
        </View>
      </ScrollView>
      <AppButton
        icon={'plus'}
        style={styles.creatGroupBtn}
        onPress={goToGroupCreationScreen}
      />
    </SafeAreaView>
  )
}

export default GroupList
