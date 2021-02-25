import { Platform, PermissionsAndroid } from 'react-native'
import Contacts from 'react-native-contacts'
import forEach from 'lodash/forEach'
import uniqueId from 'lodash/uniqueId'
import * as RNLocalize from 'react-native-localize'
import { parsePhoneNumber } from 'libphonenumber-js/max'

export const formatPhoneNumber = (phone, countryCode, user) => {
  const DEVICE_COUNTRY_FALLBACK = 'US'
  try {
    let code = countryCode
    let isInvalidCountry = false
    let firstParse = null
    if (!code) {
      // Try to detect the country code from "phone"
      try {
        firstParse = parsePhoneNumber(`Phone: ${phone}`)
      } catch (error) {
        if (error.message === 'INVALID_COUNTRY') {
          isInvalidCountry = true
        }
      }
      if (isInvalidCountry) {
        if (user) {
          // Guess the country code from the user's phone number
          const { phoneNumber } = user
          const parsed = parsePhoneNumber(phoneNumber)
          if (parsed) {
            code = parsed.country
          } else {
            // Guess the country code from the device's locale
            code = RNLocalize.getCountry()
          }
        } else {
          // Guess the country code from the device's locale
          code = RNLocalize.getCountry()
        }
      } else if (firstParse) {
        // if isInvalidCountry = false and we have the firstParse
        // We can parse the country code
        code = firstParse.country
      }
      if (!code) {
        // if there's still no code ... use the default one (US)
        code = DEVICE_COUNTRY_FALLBACK
      }
    }
    // console.log(`📱 parsing phone number ${phone} - country code ${code}`)
    const phoneNumber = parsePhoneNumber(`Phone: ${phone}`, code)
    // console.log(`result: ${phoneNumber.number}`)
    return {
      number: phoneNumber.number,
      isValid: phoneNumber.isValid(),
    }
  } catch (error) {
    console.log('ERROR - formatPhoneNumber')
    console.log(error)
    return {
      number: phone,
      isValid: false,
    }
  }
}

export const getPhoneBookContacts = () =>
  new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
      Contacts.getAll((err, contacts) => {
        if (!err) {
          resolve(contacts)
        } else {
          reject(err)
        }
      })
    }
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts',
      }).then(() => {
        Contacts.getAll((err, contacts) => {
          if (!err) {
            resolve(contacts)
          } else {
            reject(err)
          }
        })
      })
    }
  })

export const formatContacts = ({ phoneBookContacts, user }) => {
  const contacts = []
  forEach(phoneBookContacts, (contact) => {
    forEach(contact.phoneNumbers, (phoneObject) => {
      if (phoneObject) {
        const { number, isValid } = formatPhoneNumber(
          phoneObject.number,
          null,
          user,
        )
        if (number && isValid) {
          let name = `${contact.givenName} ${contact.familyName}`
          // Remove white spaces
          name = name.trim()
          if (name && name.length) {
            if (number) {
              if (!contacts.find((c) => c.phoneNumber === number)) {
                const contactObject = {
                  _id: uniqueId('temp_'),
                  name,
                  phoneNumber: number,
                }
                contacts.push(contactObject)
              }
            }
          }
        }
      }
    })
  })
  return contacts
}
