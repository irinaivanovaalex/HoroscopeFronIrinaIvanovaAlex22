import React, { useState, useRef, useEffect, SetStateAction, useMemo, DependencyList } from 'react'
import { StyleProp, ViewStyle, View, StyleSheet, Platform, Text, Image, DatePickerAndroid, TextInput, StatusBar, FlatList, TextPropTypes, Button, Alert, ScrollView, AsyncStorage, ActivityIndicator, DeviceEventEmitter, Dimensions, Animated, PermissionsAndroid, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import DatePicker from 'react-native-datepicker'
import { screenWidth, GoroskopScreen, screenHeight } from './GoroskopScreen'
import { getZodiac } from '../component/getZodiac'
import { getZodiacSign, ZodiacName, ZodiacSigns } from './zodiac/ZodiacSign'
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel'
import moment from 'moment'
import Axios from 'axios'
import cheerio from 'react-native-cheerio'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { CarouselHoroscope } from './CarouselHoroscope'
import { accelerometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors"
import { CarouselHoroscopeCompatibility } from './CarouselHoroscopeCompatibility'
import { FlatlistCompatibility } from '../component/FlatlistCompatibility'


export type EntriesType = {
  id: string;
  description: string | Promise<String>;
  date: string;
  subtitle?: string;
  illustration?: string;
}

interface ProfileScreenProps {
  style?: StyleProp<ViewStyle>

}

const storeDataZodiac = async (value: string) => {
  await AsyncStorage.setItem('@MyApp_Zodiac', value)
  console.warn('Data successfully saved zodiac: ', value)
}

const storeDataName = async (value: string) => {
  await AsyncStorage.setItem('@MyApp_Name', value)
  console.warn('Data successfully saved name: ', value)
}

const storeDataDate = async (value: Date) => {
  await AsyncStorage.setItem('@MyApp_Date', value.toString())
  console.warn('Data successfully saved date', value)
}

const getDataName = async () => {
  const value = await AsyncStorage.getItem('@MyApp_Name') || "Your Name"
  console.warn('getDateName:', value)
  return value
}
const getDataDate = async () => {
  const value = await AsyncStorage.getItem('@MyApp_Date') || new Date().toLocaleDateString()
  console.warn('getDataDate: ', value)
  return new Date(value)
}
const getDataZodiac = async () => {
  const value = await AsyncStorage.getItem('@MyApp_Zodiac') || "cancer"
  console.warn('getDateZodiac:', value)
  return value
}

export const fetchItem = async (zodiac: string, title: string, day: string) => {
  const result: string = await parseHoroscope(zodiac, title, day)
  console.warn('hj', result)
  return result
}

setUpdateIntervalForType(SensorTypes.accelerometer, 32)

export function useAsync<T>(deferred: () => Promise<T>, deps: DependencyList) {
  useEffect(() => {
    async function go() {
      deferred()
    }
    go()
  }, deps)
}

export const ProfileScreen: React.FC<ProfileScreenProps> = props => {
  const { style } = props
  const [value, onChangText] = useState('Your Name')
  useEffect(() => {
    getDataName().then(onChangText)
  }, [])

  const [animationLoad, setAnimation] = useState(false);
  const [animationLoadLove, setAnimationLove] = useState(false);
  const [animationLoadCareer, setAnimationCareer] = useState(false);
  const [dateBirth, setDateBirth] = useState<Date>()
  const [descriptionSovmestimost, setDescriptionSovmestimost] = useState('');

  const [zodiac, setZodiac] = useState(getZodiacSign(new Date().getDate(), new Date().getMonth() + 1)?.name)

  useAsync(async () => {
    const storedZodiac = getZodiacSign(dateBirth.getDate(), dateBirth.getMonth() + 1)?.name
    setZodiac(storedZodiac ? storedZodiac : 'leo')
    console.log('zodiac: ', zodiac)
    console.log('weig', screenWidth, screenHeight)
    storeDataZodiac(storedZodiac ? storedZodiac : 'leo')
  }, [zodiac, dateBirth])

  const [entriesCareer, setEntriesCareer] = useState<EntriesType[]>([
    {
      id: '7',
      description: '',
      date: moment().add(0, 'day').format('LL').toString()
    },
    {
      id: '8',
      description: '',
      date: moment().add(0, 'day').format('LL').toString()
    },
    {
      id: '9',
      description: '',
      date: moment().add(0, 'day').format('LL').toString()
    }
  ]);
  const [entries, setEntries] = useState<EntriesType[]>([
    {
      id: '1',
      description: '',
      date: moment().add(-1, 'day').format('LL').toString(),
      subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
      illustration: 'https://5sfer.com/wp-content/uploads/2015/08/8ipwnn.jpg',
    },
    {
      id: '2',
      description: '',
      date: moment().add(0, 'day').format('LL').toString(),
      subtitle: 'Lorem ipsum dolor sit amet',
      illustration: 'https://i.ytimg.com/vi/dX8kSHknlyU/maxresdefault.jpg',
    },
    {
      id: '3',
      description: '',
      date: moment().add(1, 'day').format('LL').toString(),
      subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
      illustration: 'https://cdni.rt.com/russian/images/2019.08/article/5d63aa84370f2c6e1d8b4589.jpg',
    }]);
  const [entriesLove, setEntriesLove] = useState<EntriesType[]>([
    {
      id: '4',
      description: '',
      date: moment().add(-1, 'day').format('LL').toString(),
      subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
      illustration: 'https://5sfer.com/wp-content/uploads/2015/08/8ipwnn.jpg',
    },
    {
      id: '5',
      description: '',
      date: moment().add(0, 'day').format('LL').toString(),
      subtitle: 'Lorem ipsum dolor sit amet',
      illustration: 'https://i.ytimg.com/vi/dX8kSHknlyU/maxresdefault.jpg',
    },
    {
      id: '6',
      description: '',
      date: moment().add(1, 'day').format('LL').toString(),
      subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
      illustration: 'https://cdni.rt.com/russian/images/2019.08/article/5d63aa84370f2c6e1d8b4589.jpg',
    },

  ]);

  // useEffect(() => {

  //   if (dateBirth) {

  //     storeDataDate(dateBirth)
  //     setAnimation(true)
  //     setAnimationLove(true)
  //     const zodiacParametr = getDataZodiac()

  //     async function fetchHoroscope(title: string, setAnimated: (isEnabled: React.SetStateAction<boolean>) => void, entriesItem: EntriesType[], setEntriesItem: (entriesItemIndex: React.SetStateAction<EntriesType[]>) => void) {
  //       const horoscopes = [
  //         await fetchItem(await zodiacParametr, title, 'yesterday'),
  //         await fetchItem(await zodiacParametr, title, ''),
  //         await fetchItem(await zodiacParametr, title, 'tomorrow')
  //       ]
  //       setAnimated(false)
  //       const dateHoroscope = entriesItem.map((item, index) => {
  //         return {
  //           ...item,
  //           description: horoscopes[index],

  //         }

  //       })
  //       setEntriesItem(dateHoroscope)
  //     }
  //     fetchHoroscope('/', setAnimation, entries, setEntries)
  //     fetchHoroscope('/erotic/', setAnimationLove, entriesLove, setEntriesLove)
  //     fetchHoroscope('/career/', setAnimationCareer, entriesCareer, setEntriesCareer)


  //   } else {
  //     async function go() {
  //       const storedDate = await getDataDate()
  //       setDateBirth(storedDate)

  //     }
  //     go()
  //   }
  // }, [dateBirth])

  const animatedX = useMemo(() => new Animated.Value(0), [])
  const animatedY = useMemo(() => new Animated.Value(0), [])
  const animatedZ = useMemo(() => new Animated.Value(0), [])

  function decayX(xPar: number) {
    Animated.decay(
      animatedX,
      {
        velocity: 0.4,
        deceleration: 0.6,
        useNativeDriver: true,
      }
    ).start()
  }
  function decayY(yPar: number) {
    Animated.decay(
      animatedY,
      {
        velocity: 0.4,
        deceleration: 0.6,
        useNativeDriver: true,
      }
    ).start()
  }

  // useEffect(() => {
  //   const subscription = accelerometer.subscribe(({ x, y, z, }) => {
  //     animatedX.setValue(x)
  //     animatedY.setValue(y)
  //     animatedZ.setValue(z)
  //     decayX(x)
  //     decayY(y)
  //     console.log(JSON.stringify({ x, y, z, }, null, '  '))
  //   })
  // }, [])

  const [selectedWoman, setWomanZodiac] = useState<ZodiacName>()
  const [selectedMan, setManZodiac] = useState<ZodiacName>()
  const [isVisible, setVisible] = useState(false)

  useEffect(() => {
    setManZodiac('gemini')
    setWomanZodiac('gemini')
  }, [])

  return (
    <>

      <LinearGradient
        colors={['#303f52', '#333132']}
        style={styles.linearGradient}
      //end={{ x: 2, y: 2 }}
      // start={{ x: 0, y: 0.25 }}
      >
        <StatusBar
          translucent={true}
          backgroundColor={'rgba(0, 100, 0, 0)'}
        />
        <View style={styles.conteinerTopBar}>
          <Image
            source={require('../component/image/space3.jpg')}
            blurRadius={0.1}
            style={{
              alignSelf: 'center',
              alignContent: 'center',
              position: 'absolute',
              opacity: 0.3,
              transform: [{
                rotate: '90deg',

              },
              {
                translateX: -30,
              }]
            }}
          />
          <Animated.View style={{
            transform: [{
              translateX: animatedX.interpolate({
                inputRange: [-10, 0, 10],
                outputRange: [-50, 0, 50],
              })
            }, {
              translateY: animatedY.interpolate({
                inputRange: [-10, 0, 10],
                outputRange: [-100 - (-50), -100, -100 - (50)],
              })
            },],


          }}>
            <Image
              source={require('../component/image/space3.jpg')}
              blurRadius={0.2}
              style={{
                alignSelf: 'center',
                alignContent: 'center',
                position: 'absolute',
                opacity: 0.3,
              }}
            />
          </Animated.View>
          <View style={styles.conteinerMain}>

            <View style={styles.textContainer}>

              <Text style={styles.description} numberOfLines={2}>ГОРОСКОП</Text>
            </View>

            <View style={styles.topBar} >
              <Image
                source={dateBirth ? getZodiacSign(dateBirth.getDate(), dateBirth.getMonth() + 1)?.emoji : undefined}
                style={{
                  alignSelf: 'center',
                  alignContent: 'center',
                  width: 50,
                  height: 50,
                  //marginBottom: 35,
                  borderRadius: 150,
                }}
                resizeMode="stretch"
                resizeMethod="scale"
              />
            </View>

          </View>

        </View>
        <KeyboardAwareScrollView

          showsVerticalScrollIndicator={false}
          bouncesZoom={true}
          style={{
            //paddingBottom: 30,
            paddingBottom: 15,
          }}

        >

          <View style={styles.conteinerTopBar}>
            <View style={styles.conteiner}>
              <Text style={styles.symbol}>ИМЯ</Text>
              <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={value => {
                  onChangText(value)
                  storeDataName(value)

                }}

              />
            </View>
            <View style={styles.conteiner}>
              <Text style={styles.symbol}>ДЕНЬ РОЖДЕНИЯ</Text>
              <DatePicker
                date={dateBirth}
                mode="date"
                format="DD-MM-YYYY"
                minDate="01-05-1900"
                maxDate={new Date()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                androidMode="spinner"
                showIcon={false}
                allowFontScaling={true}

                style={{

                }}
                customStyles={{
                  dateText: {
                    fontFamily: 'Montserrat-Light',
                    fontSize: 18,
                    color: '#e6e4e2'
                  },
                  dateIcon: {
                    left: 0,
                    top: 0,
                    marginLeft: 0,
                  },
                  dateInput: {
                    borderWidth: 0,
                    marginEnd: 1,
                    alignItems: 'flex-end',

                  },

                }}
                onDateChange={async (dateStr, date) => {
                  setDateBirth(date)
                  setAnimation(true)
                  setAnimationLove(true)
                }}
              >

              </DatePicker>
            </View>
          </View>
          <View style={styles.carousel}>
            <CarouselHoroscope
              description={'Ваш гороскоп на 3 дня'}
              entriesCarousel={entries}
              animationLoad={animationLoad}
            />
            <CarouselHoroscope
              description={'Романтичный гороскоп на 3 дня'}
              entriesCarousel={entriesLove}
              animationLoad={animationLoad}
            />
            <CarouselHoroscope
              description={'Финансовый гороскоп на 3 дня'}
              entriesCarousel={entriesCareer}
              animationLoad={animationLoadCareer}
            />

          </View>
          <Text style={styles.textTitle}>Совместимость</Text>
          <View style={styles.carousel}>
            <CarouselHoroscopeCompatibility onSelected={setManZodiac} title="Мужчина" type="man" />
          </View>
          <View style={styles.carousel}>
            <CarouselHoroscopeCompatibility onSelected={setWomanZodiac} title="Женщина" type="woman" />
          </View>
          <TouchableOpacity style={{
            marginVertical: 20,
            alignContent: 'center',
            alignSelf: 'center',
          }}
            onPress={async () => {
              console.warn('selectedMan:', selectedMan)
              console.warn('selectedWoman:', selectedWoman)
              setVisible(true)
              const fetchZodiacMan = Object.values(ZodiacSigns).find(it => it.name === selectedMan)
              const fetchZodiacWoman = Object.values(ZodiacSigns).find(it => it.name === selectedWoman)
              // setDescriptionSovmestimost(await fetchItemSovmestimost(fetchZodiacWoman?.titleru!, fetchZodiacMan?.titleru!))
            }}>
            <View style={styles.button}>
              <Text style={styles.textTitleButton}>Узнать совместимость</Text>
            </View>
          </TouchableOpacity>
          {isVisible ?
            <View style={{
              alignSelf: 'center',
              alignContent: 'center',
              justifyContent: 'center',
            }}
            ><FlatlistCompatibility zodiacMan={Object.values(ZodiacSigns).find(it => it.name === selectedMan)?.titleru!} zodiacWoman={Object.values(ZodiacSigns).find(it => it.name === selectedWoman)?.titleru!} /></View> : <></>}

        </KeyboardAwareScrollView>
      </LinearGradient>
    </>

  )
}
export async function parseHoroscope(zodiac: string, title: string, day: string) {
  const url = "https://horoscopes.rambler.ru/" + zodiac + title + day
  const response = await Axios.get(url)
  const $ = cheerio.load(response.data)
  const classItems = $(
    '#app > main > div.content._3Hki > div > div > section > div._2eGr > div > div > span',
  ).toArray()

  return classItems[0].children[0].data
}


const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  textTitle: {
    fontSize: 15,
    fontFamily: 'Montserrat-Light',
    color: '#e6e4e2',
    paddingBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  conteinerTopBar: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
  },
  topBar: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 75,
  },
  conteinerMain: {
    padding: 1,
    marginTop: 25,
    marginBottom: -5,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',

  },
  conteiner: {
    padding: 1,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between'
  },
  textContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  description: {
    textAlign: 'center',
    fontSize: 30,
    color: '#e6e4e2',
    fontFamily: 'Montserrat-SemiBold',

  },
  symbol: {
    fontSize: 18,
    justifyContent: 'flex-start',
    color: '#e6e4e2',
    alignSelf: 'center',
    alignItems: 'flex-start',
    paddingTop: 4,
    fontFamily: 'Montserrat-Light',
  },
  item: {
    width: screenWidth - 100,
    height: screenWidth - 100,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }),
    backgroundColor: 'rgba(230, 228, 226, 0.25)',
    borderRadius: 8,
  },

  textInput: {
    borderColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 5,
    alignContent: 'flex-end',
    textAlign: 'right',
    flexGrow: 1,
    color: '#e6e4e2',
    fontSize: 18,
    fontFamily: 'Montserrat-Light',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
  },
  carousel: {
    marginTop: 20,
    flexDirection: 'column',

  },
  button: {
    width: screenWidth - 100,
    height: screenWidth / 7,
    backgroundColor: 'rgba(230, 228, 226, 0.25)',
    borderRadius: 10,
    marginHorizontal: 15,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',

  },
  textTitleButton: {
    fontSize: 15,
    fontFamily: 'Montserrat-Light',
    color: '#e6e4e2',
    //paddingBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',

  },
  textDescription: {
    fontSize: 14,
    fontFamily: 'Montserrat-Light',
    color: '#e6e4e2',
    padding: 20,
    textAlign: 'justify',
  },
  conteinerSovmestimost: {
    padding: 1,
    paddingBottom: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    backgroundColor: 'rgba(230, 228, 226, 0.2)',
    borderRadius: 10,
  },
})



