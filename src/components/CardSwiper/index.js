/* eslint-disable */
import React from 'react'
import { View } from 'react-native'
import Swiper from 'react-native-deck-swiper'

class CardSwiper extends React.Component {
    constructor(props) {
        super(props)
        this.swipeLeft = this.swipeLeft.bind(this)
    }

    swipeLeft = () => {
        this.swiper.swipeLeft()
    }

    render() {
        const { data, renderCard, cardIndex, onSwipedLeft, onSwipedRight, onSwipedAll, infinite } = this.props

        return (
            <View style={{ flex: 1 }}>
            <Swiper
                cards={data}
                renderCard={renderCard}
                cardIndex={cardIndex}
                stackSize={3}
                onSwipedLeft={onSwipedLeft}
                onSwipedRight={onSwipedRight}
                onSwipedAll={onSwipedAll}
                cardVerticalMargin={0}
                cardHorizontalMargin={30}
                backgroundColor="transparent"
                disableBottomSwipe
                verticalSwipe={false}
                infinite={infinite}
                ref={swiper => this.swiper = swiper}
            >
            </Swiper>
            </View>
        )
    }
}

export default CardSwiper