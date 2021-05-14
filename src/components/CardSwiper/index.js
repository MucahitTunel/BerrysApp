/* eslint-disable */
import React from 'react'
import { View, Text } from 'react-native'
import Swiper from 'react-native-deck-swiper'

const CardSwiper = ({ data, renderCard, startIndex, onSwipedLeft, onSwipedRight }) => {

    return (
        <View style={{ flex: 1 }}>
        <Swiper
            cards={data}
            renderCard={renderCard}
            cardIndex={0}
            stackSize= {3}
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
            cardVerticalMargin={0}
            cardHorizontalMargin={30}
            backgroundColor="transparent"
            disableBottomSwipe
            verticalSwipe={false}
        >
        </Swiper>
        </View>
    )
}

export default CardSwiper