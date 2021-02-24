import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import PropTypes from 'prop-types'

const PickerComponent = ({ selectedValue, onChange, items }) => {
  const [value, setValue] = useState(selectedValue)

  const onValueChange = (itemValue) => {
    setValue(itemValue)
    onChange(itemValue)
  }

  return (
    <Picker
      style={{
        height: 100,
      }}
      itemStyle={{ height: 100 }}
      onValueChange={onValueChange}
      selectedValue={value}>
      {items.map((item, index) => {
        return <Picker.Item key={index} label={item.label} value={item.value} />
      })}
    </Picker>
  )
}

PickerComponent.propTypes = {
  selectedValue: PropTypes.any,
  onChange: PropTypes.func,
  items: PropTypes.array,
}

export default PickerComponent
