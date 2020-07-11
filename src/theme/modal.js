import { StyleSheet } from 'react-native'
import Constants from 'constants'

export default StyleSheet.create({
  modalView: {
    margin: 0,
    width: Constants.Dimensions.Width,
    height: Constants.Dimensions.Height,
  },
  modalInnerView: {
    height: Constants.Dimensions.Height,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    left: -10,
    padding: 10,
    zIndex: 1,
  },
  header: {
    color: Constants.Colors.white,
    fontSize: Constants.Styles.FontSize.xLarge,
    textAlign: 'center',
    marginTop: 20,
  },
  form: {
    marginTop: 80,
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
    color: Constants.Colors.white,
    fontSize: Constants.Styles.FontSize.normal,
  },
  error: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 13,
    color: Constants.Colors.white,
    fontStyle: 'italic',
  },
  phonePrefix: {
    fontSize: 17,
    marginTop: -10,
    color: 'rgba(255, 255, 255, 0.8)',
  },
})
