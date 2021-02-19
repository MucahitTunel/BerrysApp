import React from 'react'
import { View } from 'react-native'
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from 'recyclerlistview'
import { Dimensions } from 'constants'
import PropTypes from 'prop-types'
export default class RecyclerList extends React.Component {
  constructor(args) {
    super(args)

    this.dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2
    })

    this._layoutProvider = new LayoutProvider(
      (index) => this.props.data[index].type,
      (type, dim) => {
        switch (type) {
          case 'contact':
          case 'group':
            dim.width = Dimensions.Width
            dim.height = 55
            break
          case 'section':
            dim.width = Dimensions.Width
            dim.height = 35
            break
          default:
            dim.width = 0
            dim.height = 0
        }
      },
    )
  }

  render() {
    return (
      <View
        style={{ flex: 1, height: Dimensions.Height, width: Dimensions.Width }}>
        <RecyclerListView
          layoutProvider={this._layoutProvider}
          dataProvider={this.dataProvider.cloneWithRows(this.props.data)}
          rowRenderer={this.props.rowRenderer}
          extendedState={this.props.extendedState}
          scrollViewProps={{
            nestedScrollEnabled: true,
            showsVerticalScrollIndicator: false,
          }}
        />
      </View>
    )
  }
}

RecyclerList.propTypes = {
  data: PropTypes.array,
  extendedState: PropTypes.any,
  rowRenderer: PropTypes.func,
}
