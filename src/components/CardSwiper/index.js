/* eslint-disable */
import React from 'react'
import { View, Text } from 'react-native'
import Swiper from 'react-native-deck-swiper'

const CardSwiper = ({ data }) => {

    const renderCard = (card) => {
        return (
            <View style={{
                flex: 1,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: "#E8E8E8",
                justifyContent: "center",
                backgroundColor: "white"
            }}>
                <Text style={{
                        textAlign: "center",
                        fontSize: 50,
                        backgroundColor: "transparent"
                }}>{card}</Text>
            </View>
        )
    }

    const onSwipedLeft = (index) => {
        console.log('left', index)
    }

    const onSwipedRight = (index) => {
        console.log('right', index)
    }

    const onSwipedTop = (index) => {
        console.log('top', index)
    }

    return (
        <Swiper
            cards={['DO', 'MORE', 'OF', 'WHAT', 'MAKES', 'YOU', 'HAPPY']}
            renderCard={renderCard}
            cardIndex={0}
            backgroundColor={'#4FD0E9'}
            stackSize= {3}
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
            onSwipedTop={onSwipedTop}
            >
            
        </Swiper>
    )
}

export default CardSwiper