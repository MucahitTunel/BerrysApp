import React from 'react'
import { TextInput, StyleSheet, Text } from 'react-native'
import PropTypes from 'prop-types'
import Constants from 'constants'
import Fonts from 'assets/fonts'

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 2,
    fontSize: Constants.Styles.FontSize.large,
    color: Constants.Colors.white,
    fontFamily: Fonts.latoRegular,
    height: 50,
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
      <Text style={{ color: Constants.Colors.primary, marginBottom: 5 }}>
        {error}
      </Text>
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
