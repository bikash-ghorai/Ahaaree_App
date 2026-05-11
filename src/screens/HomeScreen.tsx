import React from 'react';
import {
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Geolocation from '@react-native-community/geolocation';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AlertTriangle, Bell, Calendar, CheckCircle2, ChevronDown, Search, Star } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import { featuredRestaurants, specials } from '../data/homeData';
import WeatherAlertTooltip from '../components/WeatherAlertTooltip';
import { useWeatherAlert } from '../contexts/WeatherAlertContext';
import type { RootStackParamList, RootTabParamList } from '../types/navigation';


const GlassLayer = () => (
  Platform.OS === 'ios' ? (
    <BlurView
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      blurType="dark"
      blurAmount={25}
      reducedTransparencyFallbackColor="rgba(18, 20, 24, 0.18)"
    />
  ) : null
);

type AddressOption = {
  id: string;
  tag: string;
  line1: string;
  line2: string;
  shortLabel: string;
};

const addressOptions: AddressOption[] = [
  {
    id: 'home',
    tag: 'Home',
    line1: '2468 Amber Crescent, Sunset Valley',
    line2: 'San Francisco, CA 94103',
    shortLabel: 'San Francisco, CA',
  },
  {
    id: 'office',
    tag: 'Office',
    line1: 'Radiant Heights Tech Tower, Suite 402',
    line2: 'Market Street, SF 94105',
    shortLabel: 'Market Street, SF',
  },
  {
    id: 'parents',
    tag: "Parents' House",
    line1: '15 Nocturne Lane, Golden Hill',
    line2: 'Oakland, CA 94611',
    shortLabel: 'Oakland, CA',
  },
];

const GOOGLE_MAPS_API_KEY = 'AIzaSyAR4jzABer8rctIaR95zM5IWBXu5R1KUYc';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { isBadWeather, show } = useWeatherAlert();
  const [selectedAddressId, setSelectedAddressId] = React.useState(addressOptions[0]?.id ?? '');
  const [isAddressSheetOpen, setIsAddressSheetOpen] = React.useState(false);
  const [currentCoords, setCurrentCoords] = React.useState<{ latitude: number; longitude: number } | null>(null);
  const [currentPlace, setCurrentPlace] = React.useState<string | null>(null);
  const [isLocating, setIsLocating] = React.useState(false);
  const selectedAddress = React.useMemo(
    () => addressOptions.find(option => option.id === selectedAddressId) ?? addressOptions[0],
    [selectedAddressId]
  );
  const locationLabel = selectedAddress
    ? `${selectedAddress.tag} · ${selectedAddress.shortLabel}`
    : 'Choose address';
  const currentLocationLabel = React.useMemo(() => {
    if (!currentCoords) {
      return null;
    }

    if (currentPlace) {
      return currentPlace;
    }

    return `Current location · ${currentCoords.latitude.toFixed(3)}, ${currentCoords.longitude.toFixed(3)}`;
  }, [currentCoords, currentPlace]);
  const resolvedLocationLabel = isLocating
    ? 'Locating current position...'
    : currentLocationLabel ?? locationLabel;

  const requestLocationPermission = React.useCallback(async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location permission',
          message: 'We use your location to show nearby restaurants and delivery options.',
          buttonPositive: 'Allow',
          buttonNegative: 'Not now',
        }
      );

      return result === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      return false;
    }
  }, []);

  const fetchCurrentLocation = React.useCallback(async () => {
    setIsLocating(true);

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setCurrentCoords(null);
      setIsLocating(false);
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setCurrentCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        setCurrentCoords(null);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  }, [requestLocationPermission]);

  React.useEffect(() => {
    fetchCurrentLocation();
  }, [fetchCurrentLocation]);

  React.useEffect(() => {
    if (!currentCoords) {
      setCurrentPlace(null);
      return;
    }

    let isActive = true;

    const reverseGeocode = async () => {
      try {
        if (!GOOGLE_MAPS_API_KEY) {
          return;
        }

        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentCoords.latitude},${currentCoords.longitude}&key=${GOOGLE_MAPS_API_KEY}&language=en`
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        console.log('Reverse geocoding result:', data);
        const bestResult = Array.isArray(data?.results) ? data.results[0] : null;
        const plusCodeCompound = data?.plus_code?.compound_code;
        const place = plusCodeCompound || bestResult?.formatted_address;

        if (isActive && typeof place === 'string') {
          setCurrentPlace(place);
        }
      } catch (error) {
        if (isActive) {
          setCurrentPlace(null);
        }
      }
    };

    reverseGeocode();

    return () => {
      isActive = false;
    };
  }, [currentCoords]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <WeatherAlertTooltip />
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXLAZpp1C5cMSy2_JHLk3TeaArbYCqDpiJOg3E7XeqYA8-s9sXC43O1upoTYYHPgUucBt0gg5jauS5_upvK4n9BlUY4Ui8aNOC_8juc3ZmjChJigqWdfxWhzGw2SEYhhOd3FaujfSau09-FXMwxEifgkJJtZLHRhMU9a7oQRqvZ6LqXhH8Tuvs_bmlyeAfwyZtYM_FIeGNw4E3LxzIfyb926TPNJbLi_QDKPqn1A2yd-Y544saFiSoAZtsQJkS98ZAr9pVm0NiFwE" }}
              style={styles.avatar}
            />
          </View>
          <View style={{ width: "55%" }}>
            <Text style={styles.welcomeText} numberOfLines={1}>Welcome, Sarah!</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.locationRow}
              onPress={() => setIsAddressSheetOpen(true)}
            >
              <Text style={styles.locationText} numberOfLines={1}>{resolvedLocationLabel}</Text>
              <ChevronDown size={14} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{
          flexDirection: 'row',
          gap: 12
        }}>
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              backgroundColor: colors.glass,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.glassBorder,
              overflow: 'hidden'
            }}
            onPress={() => navigation.navigate('Search')}
          >
            <GlassLayer />
            <Search size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              backgroundColor: colors.glass,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.glassBorder,
              overflow: 'hidden'
            }}
            onPress={() => {
              if (isBadWeather) {
                show();
              }
            }}
            accessibilityLabel="Weather warning"
          >
            <GlassLayer />
            {isBadWeather ? (
              <AlertTriangle size={20} color={colors.accentCoral} />
            ) : (
              <>
                <Bell size={20} color="#FFF" />
                <View style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 8,
                  height: 8,
                  backgroundColor: colors.primary,
                  borderRadius: 4
                }} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.heroCard}>
          <GlassLayer />
          <View style={styles.heroImageContainer}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxGNL0DERG9T_7taHIeOdBtSkXq8JXFF91p8Ku5vFG2nq9Fp4D9CzarNep_RZao1ui5qQGiBjarEGJd2rNGW8mHo9sx1EDTXKlgo8jBBlmXibf6gO2ps9lBe3bmUF_J2X0JTjIXNG4YbjscmB_hpnU-zlDA4s3QBWJwz-IkaZ85CCtAuFd0opEClyacyiZgMCcrvmDNDiacCEkHHz9mx6M-eQm8mKJeVN72a4x3J6-8upK89Je--LYh0-LvsFgARxE-Ee75BXFM5Q" }}
              style={styles.heroImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.62)']}
              start={{ x: 0.5, y: 0.25 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.heroOverlay}
            />
          </View>
          <View style={styles.heroContent}>
            <View style={styles.eventBadge}>
              <Calendar size={12} color="#FFB000" />
              <Text style={styles.eventBadgeText}>UPCOMING EVENT</Text>
            </View>
            <Text style={styles.heroTitle}>Celebrate Chloe's Birthday Soon!</Text>
            <Text style={styles.heroSubtitle}>Make her day special with her favorite artisanal treats and desserts from the best bakeries.</Text>
            <TouchableOpacity style={styles.planButton}>
              <Text style={styles.planButtonText}>Plan Party</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Specials</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {specials.map(item => (
            <TouchableOpacity key={item.id} style={styles.specialCard}>
              <View style={styles.specialImageContainer}>
                <GlassLayer />
                <Image source={{ uri: item.image }} style={styles.specialImage} />
                <View style={styles.priceBadge}>
                  <GlassLayer />
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
              </View>
              <Text style={styles.specialTitle}>{item.title}</Text>
              <View style={styles.ratingContainer}>
                <Star size={14} color="#FFB000" fill="#FFB000" />
                <Text style={styles.ratingText}>{item.rating} ({item.reviews} reviews)</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Restaurants</Text>
        </View>
        <View style={styles.restaurantList}>
          {featuredRestaurants.map(restaurant => (
            <TouchableOpacity key={restaurant.id} style={styles.restaurantCard}>
              <GlassLayer />
              <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
              <View style={styles.restaurantInfo}>
                <View style={styles.restaurantHeader}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <CheckCircle2 size={18} color={colors.primary} />
                </View>
                <Text style={styles.restaurantDetails}>
                  {restaurant.type}  -  {restaurant.time}
                </Text>
                <View style={styles.restaurantBadges}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{restaurant.tag}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{restaurant.rating}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        transparent
        animationType="slide"
        visible={isAddressSheetOpen}
        onRequestClose={() => setIsAddressSheetOpen(false)}
      >
        <View style={styles.sheetWrapper}>
          <Pressable
            style={styles.sheetBackdrop}
            onPress={() => setIsAddressSheetOpen(false)}
          />
          <View style={styles.sheetContainer}>
            <GlassLayer />
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Choose delivery address</Text>
            <View style={styles.sheetList}>
              {addressOptions.map(option => {
                const isSelected = option.id === selectedAddressId;

                return (
                  <TouchableOpacity
                    key={option.id}
                    activeOpacity={0.9}
                    style={[styles.addressOption, isSelected ? styles.addressOptionActive : null]}
                    onPress={() => {
                      setSelectedAddressId(option.id);
                      setIsAddressSheetOpen(false);
                    }}
                  >
                    <GlassLayer />
                    <View style={styles.addressOptionHeader}>
                      <Text style={styles.addressTag}>{option.tag}</Text>
                      {isSelected ? (
                        <View style={styles.addressSelectedBadge}>
                          <Text style={styles.addressSelectedBadgeText}>Selected</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.addressLine}>{option.line1}</Text>
                    <Text style={styles.addressLine}>{option.line2}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={styles.manageAddressButton}
              activeOpacity={0.9}
              onPress={() => {
                setIsAddressSheetOpen(false);
                navigation.navigate('SelectAddress');
              }}
            >
              <Text style={styles.manageAddressText}>Manage addresses</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  welcomeText: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: 'bold',
  },
  locationText: {
    color: colors.textMuted,
    fontSize: typography.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroCard: {
    marginHorizontal: layout.screenPadding,
    backgroundColor: colors.glass,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  heroImageContainer: {
    width: '100%',
    aspectRatio: 16 / 10,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  heroContent: {
    padding: 24,
    gap: 16,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 176, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  eventBadgeText: {
    color: colors.primary,
    fontSize: typography.sm,
    fontWeight: 'bold',
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: typography.xxl,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
  },
  planButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 24,
    paddingHorizontal: layout.screenPadding,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    width: '100%',
  },
  planButtonText: {
    color: colors.black,
    fontSize: typography.md,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '500',
  },
  horizontalScroll: {
    paddingLeft: 24,
  },
  horizontalScrollContent: {
    paddingRight: 48,
    gap: 20,
  },
  specialCard: {
    width: 280,
    gap: 16,
  },
  specialImageContainer: {
    backgroundColor: colors.glass,
    padding: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    aspectRatio: 4 / 3,
  },
  specialImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  priceBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  priceText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: typography.body,
  },
  specialTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
  },
  restaurantList: {
    paddingHorizontal: layout.screenPadding,
    gap: 16,
  },
  restaurantCard: {
    backgroundColor: colors.glass,
    padding: 16,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: 'bold',
  },
  restaurantDetails: {
    color: colors.textMuted,
    fontSize: typography.sm,
    marginTop: 4,
    marginBottom: 8,
  },
  restaurantBadges: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: 'bold',
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: colors.overlayDarkStrong,
  },
  sheetContainer: {
    backgroundColor: colors.surfaceDark,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 46,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    marginBottom: 12,
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: '700',
    marginBottom: 12,
  },
  sheetList: {
    gap: 12,
  },
  addressOption: {
    backgroundColor: colors.glass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 14,
    overflow: 'hidden',
  },
  addressOptionActive: {
    borderColor: 'rgba(255, 176, 0, 0.45)',
    backgroundColor: 'rgba(255, 176, 0, 0.08)',
  },
  addressOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  addressTag: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: '600',
  },
  addressLine: {
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 18,
  },
  addressSelectedBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  addressSelectedBadgeText: {
    color: colors.black,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  manageAddressButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  manageAddressText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '600',
  },
});
