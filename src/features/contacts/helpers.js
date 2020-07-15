import { Platform, PermissionsAndroid } from 'react-native'
import Contacts from 'react-native-contacts'
import forEach from 'lodash/forEach'
import uniqueId from 'lodash/uniqueId'
import * as RNLocalize from 'react-native-localize'
import { parsePhoneNumber } from 'libphonenumber-js/max'

export const formatPhoneNumber = (phone, countryCode) => {
  const DEVICE_COUNTRY_FALLBACK = 'US'
  try {
    let code = countryCode
    if (!code) {
      const deviceLocaleCountryCode = RNLocalize.getCountry()
      code = deviceLocaleCountryCode
        ? deviceLocaleCountryCode
        : DEVICE_COUNTRY_FALLBACK
    }
    const phoneNumber = parsePhoneNumber(`Phone: ${phone}`, code)
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

export const formatContacts = (phoneBookContacts) => {
  const contacts = []
  forEach(phoneBookContacts, (contact) => {
    forEach(contact.phoneNumbers, (phoneObject) => {
      if (phoneObject) {
        const { number, isValid } = formatPhoneNumber(phoneObject.number)
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
