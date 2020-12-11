import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native'

import { Colors, Dimensions, Screens, FontSize } from 'constants'
import * as NavigationService from 'services/navigation'
import { AppIcon, AppText, ScaleTouchable } from 'components'

const GROUP_TEMPLATES = [
  {
    _id: 1,
    iconName: 'education',
    name: 'My Class',
  },
  {
    _id: 2,
    iconName: 'work',
    name: 'My Work',
  },
  {
    _id: 3,
    iconName: 'home',
    name: 'My Neighborhood',
  },
  {
    _id: 4,
    iconName: 'running',
    name: 'My Local Clubs',
  },
  {
    _id: 5,
    iconName: 'group-senior',
    name: 'My Relatives',
  },
]

const styles = StyleSheet.create({
  container: {
    height: Dimensions.Height,
    width: Dimensions.Width,
    backgroundColor: Colors.background,
    flex: 1,
  },
  templateList: {
    marginTop: 32,
  },
  templateItem: {
    backgroundColor: Colors.white,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderColor: Colors.background,
  },
  templateItemLast: {
    borderBottomWidth: 0,
  },
  templateItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

const goToUpsertGroupScreen = () => {
  NavigationService.navigate(Screens.UpsertGroup)
}

const GroupCreation = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{ padding: 16 }}>
        <AppText
          weight="medium"
          color={Colors.gray}
          fontSize={FontSize.normal}
          style={{ textAlign: 'center' }}>
          Create your own groups. Have the most honest conversations ever
        </AppText>
        <ScaleTouchable
          onPress={goToUpsertGroupScreen}
          style={[styles.templateItem, { marginTop: 16 }]}>
          <View style={styles.templateItemLeft}>
            <AppIcon name="plus" color={Colors.primary} size={16} />
            <AppText style={{ marginLeft: 12 }} color={Colors.primary}>
              Create your own
            </AppText>
          </View>
          <AppIcon name="chevron-right" size={20} color={Colors.gray} />
        </ScaleTouchable>
        <View style={styles.templateList}>
          <AppText
            weight="medium"
            fontSize={FontSize.xLarge}
            style={{ marginBottom: 12 }}>
            Start From Templates
          </AppText>
          <View>
            {GROUP_TEMPLATES.map((template) => (
              <ScaleTouchable
                key={template._id}
                onPress={goToUpsertGroupScreen}
                style={styles.templateItem}>
                <View style={styles.templateItemLeft}>
                  <View style={{ minWidth: 30, alignItems: 'center' }}>
                    <AppIcon
                      name={template.iconName}
                      color={Colors.primary}
                      size={20}
                    />
                  </View>
                  <AppText style={{ marginLeft: 12 }}>{template.name}</AppText>
                </View>
                <AppIcon name="chevron-right" size={20} color={Colors.gray} />
              </ScaleTouchable>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default GroupCreation
