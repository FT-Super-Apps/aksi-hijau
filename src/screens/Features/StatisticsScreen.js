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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../constants/typography';

const { width, height } = Dimensions.get('window');

export default function StatisticsScreen({ navigation }) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const periods = [
    { id: 'week', label: 'Minggu' },
    { id: 'month', label: 'Bulan' },
    { id: 'year', label: 'Tahun' },
  ];

  const environmentalImpact = {
    co2Absorbed: { current: 2.3, target: 5.0, unit: 'Ton' },
    temperatureReduced: { current: 0.8, target: 2.0, unit: '°C' },
    greenAreaCreated: { current: 156, target: 300, unit: 'm²' },
  };

  const monthlyProgress = [
    { month: 'Jan', trees: 2, co2: 0.3 },
    { month: 'Feb', trees: 3, co2: 0.4 },
    { month: 'Mar', trees: 4, co2: 0.6 },
    { month: 'Apr', trees: 5, co2: 0.8 },
    { month: 'May', trees: 3, co2: 0.5 },
    { month: 'Jun', trees: 6, co2: 0.9 },
    { month: 'Jul', trees: 4, co2: 0.7 },
    { month: 'Agu', trees: 7, co2: 1.1 },
  ];

  const target2024 = {
    goal: 50,
    current: 23,
    percentage: 46
  };

  const renderImpactCard = (title, data, icon, color) => {
    const percentage = (data.current / data.target) * 100;
    const segments = 20;
    const filledSegments = Math.floor((percentage / 100) * segments);

    return (
      <View style={styles.impactCard}>
        <View style={styles.impactHeader}>
          <Text style={styles.impactIcon}>{icon}</Text>
          <Text style={styles.impactTitle}>{title}</Text>
        </View>

        <View style={styles.impactValues}>
          <Text style={[styles.impactCurrent, { color }]}>
            {data.current}
          </Text>
          <Text style={styles.impactTarget}>/ {data.target} {data.unit}</Text>
        </View>

        <View style={styles.impactBar}>
          {Array.from({ length: segments }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.impactSegment,
                {
                  backgroundColor: index < filledSegments ? color : COLORS.GRAY_200,
                }
              ]}
            />
          ))}
        </View>

        <Text style={styles.impactPercentage}>
          {Math.round(percentage)}% tercapai
        </Text>
      </View>
    );
  };

  const renderBarChart = () => {
    const maxTrees = Math.max(...monthlyProgress.map(m => m.trees));

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Progress Bulanan</Text>
        <View style={styles.chart}>
          {monthlyProgress.map((month, index) => {
            const barHeight = (month.trees / maxTrees) * 100;

            return (
              <View key={month.month} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <LinearGradient
                    colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
                    style={[styles.bar, { height: `${barHeight}%` }]}
                  />
                </View>
                <Text style={styles.barValue}>{month.trees}</Text>
                <Text style={styles.barLabel}>{month.month}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.PRIMARY }]} />
            <Text style={styles.legendText}>Pohon Ditanam</Text>
          </View>
        </View>
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
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Statistik Lingkungan</Text>

          <View style={styles.placeholder} />
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period.id && styles.periodTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Environmental Impact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dampak Lingkungan Anda:</Text>

          {renderImpactCard(
            'CO2 Diserap',
            environmentalImpact.co2Absorbed,
            '🌍',
            COLORS.PRIMARY
          )}

          {renderImpactCard(
            'Suhu Diturunkan',
            environmentalImpact.temperatureReduced,
            '🌡️',
            COLORS.ACCENT
          )}

          {renderImpactCard(
            'Area Hijau Dibuat',
            environmentalImpact.greenAreaCreated,
            '🌳',
            COLORS.SUCCESS
          )}
        </View>

        {/* Monthly Progress Chart */}
        <View style={styles.section}>
          {renderBarChart()}
        </View>

        {/* 2024 Target */}
        <View style={styles.section}>
          <View style={styles.targetCard}>
            <LinearGradient
              colors={[COLORS.SECONDARY, COLORS.SECONDARY + 'CC']}
              style={styles.targetGradient}
            >
              <Text style={styles.targetTitle}>Target 2024: {target2024.goal} pohon</Text>

              <View style={styles.targetProgress}>
                <View style={styles.targetProgressBar}>
                  <LinearGradient
                    colors={[COLORS.WHITE, COLORS.WHITE + 'CC']}
                    style={[
                      styles.targetProgressFill,
                      { width: `${target2024.percentage}%` }
                    ]}
                  />
                </View>
                <Text style={styles.targetPercentage}>
                  Progress: {target2024.percentage}%
                </Text>
              </View>

              <View style={styles.targetStats}>
                <View style={styles.targetStat}>
                  <Text style={styles.targetStatValue}>{target2024.current}</Text>
                  <Text style={styles.targetStatLabel}>Sudah Ditanam</Text>
                </View>
                <View style={styles.targetStat}>
                  <Text style={styles.targetStatValue}>
                    {target2024.goal - target2024.current}
                  </Text>
                  <Text style={styles.targetStatLabel}>Sisa Target</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Additional Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wawasan Tambahan</Text>

          <View style={styles.insightCard}>
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>🎯</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Konsistensi Bagus!</Text>
                <Text style={styles.insightDescription}>
                  Anda telah menanam pohon selama 3 bulan berturut-turut
                </Text>
              </View>
            </View>

            <View style={styles.insightDivider} />

            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>📈</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Trending Naik</Text>
                <Text style={styles.insightDescription}>
                  Kontribusi Anda meningkat 40% dibanding bulan lalu
                </Text>
              </View>
            </View>

            <View style={styles.insightDivider} />

            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>🏆</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Top Contributor</Text>
                <Text style={styles.insightDescription}>
                  Anda berada di posisi #15 di Makassar
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
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
  backButton: {
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
    fontSize: FONT_SIZES.H4,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },

  // Period Selector Styles
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE + '15',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: COLORS.WHITE,
  },
  periodText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  periodTextActive: {
    color: COLORS.PRIMARY,
  },

  content: {
    flex: 1,
  },

  // Section Styles
  section: {
    padding: SPACING.PADDING.XL,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.LG,
  },

  // Impact Card Styles
  impactCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: SPACING.PADDING.LG,
    marginBottom: SPACING.MARGIN.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.MD,
  },
  impactIcon: {
    fontSize: 24,
    marginRight: SPACING.MARGIN.SM,
  },
  impactTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  impactValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.MARGIN.MD,
  },
  impactCurrent: {
    fontSize: FONT_SIZES.H3,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  impactTarget: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginLeft: 4,
  },
  impactBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.GRAY_200,
    marginBottom: SPACING.MARGIN.SM,
  },
  impactSegment: {
    flex: 1,
    marginRight: 1,
    borderRadius: 1,
  },
  impactPercentage: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },

  // Chart Styles
  chartContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: SPACING.PADDING.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.LG,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    marginBottom: SPACING.MARGIN.LG,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barContainer: {
    flex: 1,
    width: '70%',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 8,
  },
  barValue: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },

  // Target Card Styles
  targetCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  targetGradient: {
    padding: SPACING.PADDING.XL,
  },
  targetTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    textAlign: 'center',
    marginBottom: SPACING.MARGIN.LG,
  },
  targetProgress: {
    marginBottom: SPACING.MARGIN.LG,
  },
  targetProgressBar: {
    height: 12,
    backgroundColor: COLORS.WHITE + '30',
    borderRadius: 6,
    marginBottom: SPACING.MARGIN.SM,
  },
  targetProgressFill: {
    height: '100%',
    borderRadius: 6,
  },
  targetPercentage: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    textAlign: 'center',
  },
  targetStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  targetStat: {
    alignItems: 'center',
  },
  targetStatValue: {
    fontSize: FONT_SIZES.H3,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  targetStatLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    opacity: 0.9,
  },

  // Insight Card Styles
  insightCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: SPACING.PADDING.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.PADDING.SM,
  },
  insightIcon: {
    fontSize: 32,
    marginRight: SPACING.MARGIN.LG,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  insightDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginVertical: SPACING.MARGIN.MD,
  },

  bottomSpacing: {
    height: 40,
  },
});
