import React from 'react'
import { View } from 'react-native'
import TouchableWrapper from '../TouchableWrapper'
import AppIcon from '../AppIcon'
import Avatar from '../Avatar'
import AppText from '../AppText'
import Images from 'assets/images'
import { Colors } from 'constants'
import PropTypes from 'prop-types'

const ContactsListItem = ({
  isChecked,
  checkCondition,
  item,
  showRightText,
  style,
  onPress,
  isContact,
}) => {
  let text = item.name
  if (isChecked && checkCondition === 'isBlocked') {
    text = `${item.name} (invisible)`
  }
  if (isChecked && checkCondition === 'isBlacklisted') {
    text = `${item.name} (blacklisted)`
  }
  const rightText = showRightText && item.isAppUser ? `active` : ''

  return (
    <TouchableWrapper style={style} onPressItem={item} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar source={Images.newProfile} size={28} />
        <AppText
          style={{ marginLeft: 10, maxWidth: 250 }}
          weight="medium"
          numberOfLines={1}>
          {text || ''}
          {isContact && <AppText color={Colors.gray}>{rightText}</AppText>}
        </AppText>
      </View>
      <View>
        <AppIcon
          name="checkmark"
          size={22}
          color={Colors.background}
          style={{
            backgroundColor: isChecked
              ? Colors.purple
              : Colors.backgroundDarker,
          }}
          background
        />
      </View>
    </TouchableWrapper>
  )
}

ContactsListItem.propTypes = {
  isChecked: PropTypes.bool,
  checkCondition: PropTypes.string,
  item: PropTypes.object,
  showRightText: PropTypes.bool,
  style: PropTypes.object,
  onPress: PropTypes.func,
  isContact: PropTypes.bool,
}

export default React.memo(ContactsListItem)
