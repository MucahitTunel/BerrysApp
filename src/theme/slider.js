import { StyleSheet } from 'react-native'
import Constants from 'constants'
import Fonts from 'assets/fonts'

export default StyleSheet.create({
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 12,
    height: 6,
    borderRadius: 3,
  },
  itemDescription: {
    marginTop: 40,
    textAlign: 'center',
  },
  itemTitle: {
    fontSize: Constants.Styles.FontSize.xxLarge,
    color: Constants.Colors.white,
    fontFamily: Fonts.fjallaOne,
  },
})
