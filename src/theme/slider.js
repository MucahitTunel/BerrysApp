import { StyleSheet } from 'react-native'
import { Colors, FontSize } from 'constants'
import Fonts from 'assets/fonts'

export default StyleSheet.create({
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgb(213, 213, 213)',
    marginHorizontal: 2,
  },
  imagesView: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  textView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  itemTitle: {
    fontSize: FontSize.xxLarge,
    fontFamily: Fonts.euclidCircularASemiBold,
    marginBottom: 10,
  },
  itemDescription: {
    color: Colors.gray,
    fontSize: 17,
    textAlign: 'center',
  },
})
