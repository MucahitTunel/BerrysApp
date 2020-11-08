import React from 'react'
import { TextInput, StyleSheet, Text } from 'react-native'
import PropTypes from 'prop-types'
import { Styles, Colors } from 'constants'
import Fonts from 'assets/fonts'

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 10,
    borderRadius: 2,
    fontSize: Styles.FontSize.xLarge,
    color: Colors.white,
    fontFamily: Fonts.euclidCircularARegular,
    height: 56,
  },
})

const AppInput = ({ value, onChange, error, ...rest }) => (
  <React.Fragment>
    <TextInput
      style={styles.input}
      onChangeText={onChange}
      value={value}
      {...rest}
    />
    {error && (
      <Text style={{ color: Colors.primary, marginBottom: 5 }}>{error}</Text>
    )}
  </React.Fragment>
)

AppInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
}

AppInput.defaultProps = {
  value: null,
  onChange: null,
  error: null,
}

export default AppInput
