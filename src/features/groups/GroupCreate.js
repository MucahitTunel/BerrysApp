import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'

import { Colors, Dimensions, Screens, FontSize } from 'constants'
import * as NavigationService from 'services/navigation'
import { AppIcon, AppText, ScaleTouchable, Layout } from 'components'
import { setNewGroupTemplate } from './groupSlice'

const GROUP_TEMPLATE_OWN = { name: 'My Own' }

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
    backgroundColor: 'transparent',
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
    borderRadius: 10,
    marginBottom: 5,
  },
  templateItemLast: {
    borderBottomWidth: 0,
  },
  templateItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

const GroupCreate = () => {
  const dispatch = useDispatch()
  const goToGroupUpsertScreen = (template) => {
    dispatch(setNewGroupTemplate(template.name))
    NavigationService.navigate(Screens.GroupUpsert, { isCreate: true })
  }
  return (
    <Layout>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={{ padding: 16 }}>
          <AppText
            weight="medium"
            color={Colors.purpleText}
            fontSize={FontSize.normal}
            style={{ textAlign: 'center' }}>
            Create your own groups. Have the most honest conversations ever
          </AppText>
          <ScaleTouchable
            onPress={() => goToGroupUpsertScreen(GROUP_TEMPLATE_OWN)}
            style={[styles.templateItem, { marginTop: 16 }]}>
            <View style={styles.templateItemLeft}>
              <AppIcon name="plus" color={Colors.purple} size={16} />
              <AppText style={{ marginLeft: 12 }} color={Colors.purple}>
                Create your own
              </AppText>
            </View>
            <AppIcon name="chevron-right" size={20} color={Colors.gray} />
          </ScaleTouchable>
          <View style={styles.templateList}>
            <AppText
              weight="medium"
              fontSize={FontSize.xLarge}
              style={{ marginBottom: 12 }}
              color={Colors.purpleText}>
              Start From Templates
            </AppText>
            <View>
              {GROUP_TEMPLATES.map((template) => (
                <ScaleTouchable
                  key={template._id}
                  onPress={() => goToGroupUpsertScreen(template)}
                  style={styles.templateItem}>
                  <View style={styles.templateItemLeft}>
                    <View style={{ minWidth: 30, alignItems: 'center' }}>
                      <AppIcon
                        name={template.iconName}
                        color={Colors.purple}
                        size={20}
                      />
                    </View>
                    <AppText
                      style={{ marginLeft: 12 }}
                      color={Colors.purpleText}>
                      {template.name}
                    </AppText>
                  </View>
                  <AppIcon name="chevron-right" size={20} color={Colors.gray} />
                </ScaleTouchable>
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Layout>
  )
}

export default GroupCreate
