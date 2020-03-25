import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from 'constants/colors'

const ButtonContainer = styled.TouchableOpacity`
	width: 100px;
	height: 40px
	padding: 12px;
	border-radius: 10px;	
	background-color: ${props => props.backgroundColor};
`

const ButtonText = styled.Text`
  font-size: 15px;
  color: ${props => props.textColor};
  text-align: center;
`

const AppButton = ({ backgroundColor, textColor, text, ...rest }) => (
  <ButtonContainer backgroundColor={backgroundColor} {...rest}>
    <ButtonText textColor={textColor}>{text}</ButtonText>
  </ButtonContainer>
)

AppButton.propTypes = {
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  text: PropTypes.string,
}

AppButton.defaultProps = {
  backgroundColor: Colors.GRAY,
  textColor: Colors.DARK,
  text: 'default',
}

export default AppButton
