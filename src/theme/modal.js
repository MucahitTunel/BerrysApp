import { StyleSheet } from 'react-native'
import { Dimensions, Colors, Styles } from 'constants'
import Fonts from 'assets/fonts'

export default StyleSheet.create({
  modalView: {
    margin: 0,
    width: Dimensions.Width,
    height: Dimensions.Height,
  },
  modalInnerView: {
    height: Dimensions.Height,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    left: -10,
    padding: 10,
    zIndex: 1,
  },
  form: {
    marginTop: 54,
    marginBottom: 20,
  },
  bottomView: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    color: Colors.white,
    fontSize: Styles.FontSize.normal,
  },
  error: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 13,
    color: Colors.white,
    fontStyle: 'italic',
  },
  phonePrefix: {
    fontSize: Styles.FontSize.xLarge,
    color: Colors.white,
    fontFamily: Fonts.euclidCircularAMedium,
    marginRight: 4,
  },
})
