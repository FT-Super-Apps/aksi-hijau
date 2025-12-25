import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';

const { width, height } = Dimensions.get('window');

export default function CarbonCalculatorScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    electricity: '',
    gas: '',
    transportation: 'car',
    transportationDistance: '',
    diet: 'omnivore',
    waste: '',
  });
  const [result, setResult] = useState(null);

  const transportOptions = [
    { id: 'car', label: 'Mobil 🚗', factor: 0.21 },
    { id: 'motorcycle', label: 'Motor 🏍️', factor: 0.103 },
    { id: 'public', label: 'Transportasi Umum 🚌', factor: 0.089 },
    { id: 'bicycle', label: 'Sepeda 🚲', factor: 0 },
  ];

  const dietOptions = [
    { id: 'omnivore', label: 'Omnivora 🍖', factor: 2500 },
    { id: 'vegetarian', label: 'Vegetarian 🥗', factor: 1700 },
    { id: 'vegan', label: 'Vegan 🌱', factor: 1500 },
  ];

  const calculateCarbon = () => {
    // Electricity: kWh/month * 12 * 0.5 kg CO2/kWh
    const electricityCarbon = (parseFloat(formData.electricity) || 0) * 12 * 0.5;

    // Gas: liters/week * 52 * 2.31 kg CO2/liter
    const gasCarbon = (parseFloat(formData.gas) || 0) * 52 * 2.31;

    // Transportation: km/day * 365 * factor
    const transportFactor = transportOptions.find(t => t.id === formData.transportation)?.factor || 0;
    const transportCarbon = (parseFloat(formData.transportationDistance) || 0) * 365 * transportFactor;

    // Diet: annual kg CO2
    const dietCarbon = dietOptions.find(d => d.id === formData.diet)?.factor || 0;

    // Waste: kg/week * 52 * 0.5
    const wasteCarbon = (parseFloat(formData.waste) || 0) * 52 * 0.5;

    const totalCarbon = electricityCarbon + gasCarbon + transportCarbon + dietCarbon + wasteCarbon;

    // Calculate trees needed (1 tree absorbs ~21.77 kg CO2/year)
    const treesNeeded = Math.ceil(totalCarbon / 21.77);

    setResult({
      total: totalCarbon.toFixed(2),
      electricity: electricityCarbon.toFixed(2),
      gas: gasCarbon.toFixed(2),
      transport: transportCarbon.toFixed(2),
      diet: dietCarbon.toFixed(2),
      waste: wasteCarbon.toFixed(2),
      treesNeeded: treesNeeded,
      percentage: 0, // Will be calculated based on trees planted
    });

    setStep(4); // Go to results
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Konsumsi Energi ⚡</Text>
      <Text style={styles.stepDescription}>
        Berapa banyak energi yang Anda gunakan setiap bulan?
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Listrik (kWh/bulan)</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 200"
          keyboardType="numeric"
          value={formData.electricity}
          onChangeText={(text) => setFormData({ ...formData, electricity: text })}
        />
        <Text style={styles.inputHint}>
          Cek tagihan PLN Anda untuk mengetahui konsumsi bulanan
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>BBM/Bensin (liter/minggu)</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 10"
          keyboardType="numeric"
          value={formData.gas}
          onChangeText={(text) => setFormData({ ...formData, gas: text })}
        />
        <Text style={styles.inputHint}>
          Rata-rata konsumsi BBM kendaraan per minggu
        </Text>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={() => setStep(2)}>
        <LinearGradient
          colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
          style={styles.nextButtonGradient}
        >
          <Text style={styles.nextButtonText}>Lanjut →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Transportasi 🚗</Text>
      <Text style={styles.stepDescription}>
        Bagaimana Anda biasanya bepergian?
      </Text>

      <View style={styles.optionsGrid}>
        {transportOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              formData.transportation === option.id && styles.optionCardActive
            ]}
            onPress={() => setFormData({ ...formData, transportation: option.id })}
          >
            <Text style={styles.optionLabel}>{option.label}</Text>
            {formData.transportation === option.id && (
              <View style={styles.checkMark}>
                <Text style={styles.checkMarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Jarak Tempuh (km/hari)</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 20"
          keyboardType="numeric"
          value={formData.transportationDistance}
          onChangeText={(text) => setFormData({ ...formData, transportationDistance: text })}
        />
        <Text style={styles.inputHint}>
          Estimasi total jarak yang Anda tempuh setiap hari
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButtonSmall} onPress={() => setStep(3)}>
          <LinearGradient
            colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>Lanjut →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Pola Makan & Sampah 🍽️</Text>
      <Text style={styles.stepDescription}>
        Pola konsumsi Anda sehari-hari
      </Text>

      <Text style={styles.sectionLabel}>Jenis Diet</Text>
      <View style={styles.optionsGrid}>
        {dietOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              formData.diet === option.id && styles.optionCardActive
            ]}
            onPress={() => setFormData({ ...formData, diet: option.id })}
          >
            <Text style={styles.optionLabel}>{option.label}</Text>
            {formData.diet === option.id && (
              <View style={styles.checkMark}>
                <Text style={styles.checkMarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Sampah (kg/minggu)</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: 5"
          keyboardType="numeric"
          value={formData.waste}
          onChangeText={(text) => setFormData({ ...formData, waste: text })}
        />
        <Text style={styles.inputHint}>
          Estimasi berat sampah yang dihasilkan per minggu
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButtonSmall} onPress={calculateCarbon}>
          <LinearGradient
            colors={[COLORS.SUCCESS, COLORS.SUCCESS + 'CC']}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>Hitung 🔍</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderResults = () => {
    if (!result) return null;

    const breakdownData = [
      { label: 'Listrik', value: result.electricity, icon: '⚡', color: COLORS.WARNING },
      { label: 'BBM/Bensin', value: result.gas, icon: '⛽', color: COLORS.ERROR },
      { label: 'Transportasi', value: result.transport, icon: '🚗', color: COLORS.INFO },
      { label: 'Makanan', value: result.diet, icon: '🍽️', color: COLORS.SUCCESS },
      { label: 'Sampah', value: result.waste, icon: '🗑️', color: COLORS.SECONDARY },
    ];

    return (
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {/* Total Carbon Card */}
        <View style={styles.totalCard}>
          <LinearGradient
            colors={[COLORS.ERROR, COLORS.ERROR + 'DD']}
            style={styles.totalCardGradient}
          >
            <Text style={styles.totalLabel}>Jejak Karbon Tahunan Anda</Text>
            <Text style={styles.totalValue}>{result.total}</Text>
            <Text style={styles.totalUnit}>kg CO₂e/tahun</Text>

            <View style={styles.comparisonCard}>
              <Text style={styles.comparisonText}>
                ≈ {(result.total / 1000).toFixed(2)} ton CO₂
              </Text>
              <Text style={styles.comparisonSubtext}>
                Setara dengan emisi {Math.ceil(result.total / 4600)} mobil dalam setahun
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rincian Emisi</Text>
          {breakdownData.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <View style={styles.breakdownLeft}>
                <Text style={styles.breakdownIcon}>{item.icon}</Text>
                <Text style={styles.breakdownLabel}>{item.label}</Text>
              </View>
              <View style={styles.breakdownRight}>
                <Text style={[styles.breakdownValue, { color: item.color }]}>
                  {item.value} kg
                </Text>
                <View style={styles.breakdownBar}>
                  <View
                    style={[
                      styles.breakdownBarFill,
                      {
                        width: `${(parseFloat(item.value) / parseFloat(result.total)) * 100}%`,
                        backgroundColor: item.color
                      }
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Trees Needed */}
        <View style={styles.treesCard}>
          <LinearGradient
            colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
            style={styles.treesCardGradient}
          >
            <Text style={styles.treesIcon}>🌳</Text>
            <Text style={styles.treesTitle}>Pohon yang Dibutuhkan</Text>
            <Text style={styles.treesValue}>{result.treesNeeded}</Text>
            <Text style={styles.treesDescription}>
              pohon untuk menetralkan emisi Anda
            </Text>

            <View style={styles.treesProgress}>
              <View style={styles.treesProgressBar}>
                <View style={[styles.treesProgressFill, { width: '23%' }]} />
              </View>
              <Text style={styles.treesProgressText}>
                Anda sudah menanam 23 pohon (23% tercapai)
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Langkah Selanjutnya</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Camera')}
          >
            <LinearGradient
              colors={[COLORS.SUCCESS, COLORS.SUCCESS + 'DD']}
              style={styles.actionButtonGradient}
            >
              <Text style={styles.actionButtonIcon}>🌱</Text>
              <Text style={styles.actionButtonText}>Tanam Pohon Sekarang</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={[COLORS.ACCENT, COLORS.ACCENT + 'DD']}
              style={styles.actionButtonGradient}
            >
              <Text style={styles.actionButtonIcon}>💡</Text>
              <Text style={styles.actionButtonText}>Tips Kurangi Emisi</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => setStep(1)}>
            <View style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>🔄 Hitung Ulang</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    );
  };

  const renderProgressDots = () => {
    if (step === 4) return null;

    return (
      <View style={styles.progressDots}>
        {[1, 2, 3].map((dot) => (
          <View
            key={dot}
            style={[
              styles.progressDot,
              step >= dot && styles.progressDotActive
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} translucent />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButtonHeader}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Kalkulator Jejak Karbon</Text>

          <View style={styles.placeholder} />
        </View>

        {renderProgressDots()}
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderResults()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  // Header Styles
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingBottom: SPACING.PADDING.LG,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.MARGIN.LG,
  },
  backButtonHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  headerTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },

  // Progress Dots
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.WHITE + '30',
  },
  progressDotActive: {
    width: 24,
    backgroundColor: COLORS.WHITE,
  },

  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.PADDING.XL,
  },

  // Step Container
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.SM,
  },
  stepDescription: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: SPACING.MARGIN.XL,
  },

  // Input Styles
  inputGroup: {
    marginBottom: SPACING.MARGIN.XL,
  },
  inputLabel: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: SPACING.MARGIN.SM,
  },
  input: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.PADDING.LG,
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginBottom: SPACING.MARGIN.SM,
  },
  inputHint: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    fontStyle: 'italic',
  },

  // Options Grid
  sectionLabel: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: SPACING.MARGIN.MD,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.MARGIN.SM,
    marginBottom: SPACING.MARGIN.XL,
  },
  optionCard: {
    width: (width - SPACING.PADDING.XL * 2 - SPACING.MARGIN.SM * 2) / 2,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.LG,
    margin: SPACING.MARGIN.SM,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    position: 'relative',
  },
  optionCardActive: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '10',
  },
  optionLabel: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    textAlign: 'center',
  },
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Buttons
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: SPACING.MARGIN.XL,
  },
  nextButtonGradient: {
    paddingVertical: SPACING.PADDING.LG,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.MARGIN.MD,
    marginTop: SPACING.MARGIN.XL,
  },
  backButton: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 16,
    paddingVertical: SPACING.PADDING.LG,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  backButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  nextButtonSmall: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },

  // Results
  resultsContainer: {
    flex: 1,
  },
  totalCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: SPACING.MARGIN.XL,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  totalCardGradient: {
    padding: SPACING.PADDING.XXL,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    opacity: 0.9,
    marginBottom: SPACING.MARGIN.SM,
  },
  totalValue: {
    fontSize: 64,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  totalUnit: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: SPACING.MARGIN.XL,
  },
  comparisonCard: {
    backgroundColor: COLORS.WHITE + '20',
    borderRadius: 12,
    padding: SPACING.PADDING.LG,
    width: '100%',
  },
  comparisonText: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    textAlign: 'center',
    marginBottom: 4,
  },
  comparisonSubtext: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlign: 'center',
    opacity: 0.9,
  },

  // Breakdown
  section: {
    marginBottom: SPACING.MARGIN.XL,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.LG,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.LG,
    marginBottom: SPACING.MARGIN.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  breakdownIcon: {
    fontSize: 24,
    marginRight: SPACING.MARGIN.MD,
  },
  breakdownLabel: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  breakdownRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  breakdownValue: {
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  breakdownBar: {
    width: 100,
    height: 4,
    backgroundColor: COLORS.GRAY_200,
    borderRadius: 2,
  },
  breakdownBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Trees Card
  treesCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: SPACING.MARGIN.XL,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  treesCardGradient: {
    padding: SPACING.PADDING.XXL,
    alignItems: 'center',
  },
  treesIcon: {
    fontSize: 48,
    marginBottom: SPACING.MARGIN.MD,
  },
  treesTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.SM,
  },
  treesValue: {
    fontSize: 48,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  treesDescription: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    opacity: 0.9,
    marginBottom: SPACING.MARGIN.XL,
  },
  treesProgress: {
    width: '100%',
  },
  treesProgressBar: {
    height: 12,
    backgroundColor: COLORS.WHITE + '30',
    borderRadius: 6,
    marginBottom: SPACING.MARGIN.SM,
  },
  treesProgressFill: {
    height: '100%',
    backgroundColor: COLORS.WHITE,
    borderRadius: 6,
  },
  treesProgressText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlign: 'center',
    opacity: 0.9,
  },

  // Action Section
  actionSection: {
    marginBottom: SPACING.MARGIN.XL,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.MARGIN.MD,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.PADDING.LG,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginRight: SPACING.MARGIN.SM,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderRadius: 16,
    paddingVertical: SPACING.PADDING.LG,
    alignItems: 'center',
  },
  outlineButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  bottomSpacing: {
    height: 40,
  },
});

