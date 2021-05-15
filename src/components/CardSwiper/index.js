/* eslint-disable */
import React from 'react'
import { View } from 'react-native'
import Swiper from 'react-native-deck-swiper'

const CardSwiper = ({ data, renderCard, cardIndex, onSwipedLeft, onSwipedRight, onSwipedAll, infinite }) => {

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
        >
        </Swiper>
        </View>
    )
}

export default CardSwiper