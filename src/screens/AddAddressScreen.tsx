import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowUpDown,
  MapPin,
  Search,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import { colors, layout, typography } from '../constants/theme';
import GlassLayer from '../components/GlassLayer';
import Header from '../components/Header';

const surfaceColors = {
  map: '#A7A7A9',
  searchText: '#B9BEC7',
};

const AddAddressScreen = () => {
  const snapPoints = React.useMemo(() => ['40%', '82%'], []);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>

      <Header
        title="Add Address"
        showBackButton={true}
        containerStyle={{ paddingHorizontal: layout.screenPadding }}
      />

      <View style={styles.mapSection}>
        <View style={styles.searchBar}>
          <GlassLayer radius={28} tint="rgba(12, 14, 18, 0.55)" />
          <Search size={18} color={colors.primary} strokeWidth={2.4} />
          <Text style={styles.searchPlaceholder}>Search for new or enter a manual address</Text>
          <ArrowUpDown size={15} color={colors.primary} strokeWidth={2.2} />
        </View>

        <View style={styles.pinWrap}>
          <MapPin size={52} color={colors.primary} fill={colors.primary} strokeWidth={1.8} />
          <View style={styles.pinBadge}>
            <Text style={styles.pinBadgeText}>PIN LOCATION</Text>
          </View>
        </View>
      </View>

      <BottomSheet
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
        handleStyle={styles.sheetHandleWrap}
      >
        <BottomSheetView style={styles.sheetContent}>
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(255, 176, 0, 0.12)', 'rgba(18, 20, 24, 0)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.sheetGlow}
          />

          <ScrollView
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.formTitle}>Delivery Address</Text>
            <Text style={styles.formSubtitle}>
              Where should we drop your gourmet dining experience?
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>ADDRESS TAG</Text>
              <View style={styles.tagRow}>
                <TouchableOpacity activeOpacity={0.9} style={[styles.tagChip, styles.tagChipActive]}>
                  <Text style={[styles.tagText, styles.tagTextActive]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} style={styles.tagChip}>
                  <Text style={styles.tagText}>Office</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} style={styles.tagChip}>
                  <Text style={styles.tagText}>Other</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>STREET ADDRESS</Text>
              <View style={styles.inputBox}>
                <GlassLayer radius={10} tint="rgba(12, 14, 18, 0.68)" />
                <Text style={styles.inputText}>456 West 72nd Street</Text>
              </View>
            </View>

            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>APARTMENT/SUITE</Text>
                <View style={styles.inputBox}>
                  <GlassLayer radius={10} tint="rgba(12, 14, 18, 0.68)" />
                  <Text style={styles.inputText}>5C, Apt #5</Text>
                </View>
              </View>

              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>ZIP CODE</Text>
                <View style={styles.inputBox}>
                  <GlassLayer radius={10} tint="rgba(12, 14, 18, 0.68)" />
                  <Text style={styles.inputText}>10017</Text>
                </View>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CITY</Text>
              <View style={styles.inputBox}>
                <GlassLayer radius={10} tint="rgba(12, 14, 18, 0.68)" />
                <Text style={styles.inputText}>New York</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>DELIVERY NOTES</Text>
              <View style={[styles.inputBox, styles.notesBox]}>
                <GlassLayer radius={12} tint="rgba(12, 14, 18, 0.68)" />
                <Text style={styles.inputHint}>Gate code, landmarks, or drop-off preferences</Text>
              </View>
            </View>

            <View style={styles.actionArea}>
              <TouchableOpacity activeOpacity={0.95} style={styles.primaryButton}>
                <LinearGradient
                  colors={[colors.primary, '#FFC94D']}
                  start={{ x: 0.47, y: 1 }}
                  end={{ x: 0.53, y: 0 }}
                  style={styles.primaryButtonGradient}
                >
                  <Text style={styles.primaryButtonText}>Save Address</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.actionHint}>You can edit this anytime from Address List.</Text>
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapSection: {
    height: 364,
    backgroundColor: surfaceColors.map,
    overflow: 'hidden',
  },
  searchBar: {
    height: 56,
    marginHorizontal: layout.screenPadding,
    marginTop: 16,
    borderRadius: 28,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 12,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
    elevation: 8,
  },
  searchPlaceholder: {
    flex: 1,
    color: surfaceColors.searchText,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '500',
  },
  pinWrap: {
    marginTop: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBadge: {
    marginTop: 8,
    height: 24,
    minWidth: 104,
    borderRadius: 6,
    backgroundColor: colors.surfaceDark,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBadgeText: {
    color: colors.primary,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.caption,
    lineHeight: 14,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  sheetBackground: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sheetHandleWrap: {
    paddingTop: 12,
    paddingBottom: 6,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  sheetContent: {
    flex: 1,
    position: 'relative',
  },
  sheetGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  formContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
    paddingBottom: 64,
  },
  formTitle: {
    color: colors.textPrimary,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.xxl,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  formSubtitle: {
    marginTop: 6,
    width: 248,
    color: colors.textMuted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.smPlus,
    lineHeight: 20,
    fontWeight: '500',
  },
  fieldGroup: {
    marginTop: 18,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tagChip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(19, 22, 28, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagChipActive: {
    borderColor: 'rgba(255, 176, 0, 0.55)',
    backgroundColor: 'rgba(255, 176, 0, 0.14)',
  },
  tagText: {
    color: colors.textMuted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  tagTextActive: {
    color: colors.primary,
  },
  rowFields: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 16,
  },
  halfField: {
    flex: 1,
  },
  fieldLabel: {
    color: colors.primary,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputBox: {
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  inputText: {
    color: colors.textSecondary,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: '500',
  },
  inputHint: {
    color: colors.textMuted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.body,
    lineHeight: 20,
    fontWeight: '500',
  },
  notesBox: {
    height: 84,
    paddingTop: 12,
    alignItems: 'flex-start',
  },
  actionArea: {
    marginTop: 26,
    paddingBottom: 16,
    alignItems: 'center',
    gap: 10,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.lg,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  actionHint: {
    color: colors.textMuted,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.caption,
    lineHeight: 16,
    textAlign: 'center',
  },
});

export default AddAddressScreen;
