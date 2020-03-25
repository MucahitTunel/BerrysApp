import { StyleSheet } from 'react-native'
import Colors from 'constants/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: 200,
    padding: 15,
    margin: 15,
    borderRadius: 5,
    backgroundColor: Colors.GRAY,
    textAlign: 'center',
    alignItems: 'center',
  },
})

export default styles
