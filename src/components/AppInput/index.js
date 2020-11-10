import React from 'react'
import { TextInput, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Styles, Colors } from 'constants'
import Fonts from 'assets/fonts'
import { AppText } from 'components'

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 10,
    fontSize: Styles.FontSize.xLarge,
    color: Colors.white,
    fontFamily: Fonts.euclidCircularARegular,
    height: 56,
    borderRadius: 8,
  },
})

const AppInput = ({ value, onChange, error, style, ...rest }) => (
  <React.Fragment>
    <TextInput
      style={[styles.input, style]}
      onChangeText={onChange}
      value={value}
      {...rest}
    />
    {error && (
      <AppText
        fontSize={Styles.FontSize.normal}
        weight="italic"
        style={{ color: Colors.primary, marginTop: 5 }}>
        {error}
      </AppText>
    )}
  </React.Fragment>
)

AppInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
}

AppInput.defaultProps = {
  value: null,
  onChange: null,
  error: null,
}

export default AppInput
