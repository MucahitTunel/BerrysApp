import random from 'lodash/random'

const generateVerificationCode = () => String(random(100000, 999999))

export default generateVerificationCode
