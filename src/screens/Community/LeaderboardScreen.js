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
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { MOCK_LEADERBOARD } from '../../store/mockData';
import { useUserStore } from '../../store/userStore';

const { width, height } = Dimensions.get('window');

export default function LeaderboardScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('month');
  const [selectedLocation, setSelectedLocation] = useState('makassar');
  
  // Get current user data
  const { stats, profile } = useUserStore();

  const timeFilters = [
    { id: 'week', label: 'Minggu Ini' },
    { id: 'month', label: 'Bulan Ini' },
    { id: 'year', label: 'Tahun Ini' },
  ];

  const locationFilters = [
    { id: 'makassar', label: 'Makassar' },
    { id: 'sulsel', label: 'Sulawesi Selatan' },
    { id: 'indonesia', label: 'Indonesia' },
  ];

  // Transform mock data to leaderboard format
  const leaderboardData = MOCK_LEADERBOARD.map((user, index) => {
    const isCurrentUser = user.isCurrentUser;
    const badges = ['🥇', '🥈', '🥉', '', '', '', '', '', '', ''];
    
    return {
      id: user.userId,
      rank: user.rank,
      name: isCurrentUser && profile.name ? profile.name : user.name,
      trees: isCurrentUser ? stats.totalTrees : user.trees,
      avatar: null,
      badge: badges[index] || '',
      location: 'Makassar',
      streak: isCurrentUser ? stats.streak : Math.floor(Math.random() * 30) + 5,
      isCurrentUser,
    };
  });

  const communityData = [
    {
      id: 1,
      name: 'Forum Hijau Makassar',
      trees: 2345,
      members: 156,
      icon: '🏢'
    },
    {
      id: 2,
      name: 'Green Community',
      trees: 1876,
      members: 98,
      icon: '🌱'
    },
    {
      id: 3,
      name: 'Mahasiswa Peduli',
      trees: 1234,
      members: 245,
      icon: '🎓'
    }
  ];

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderAvatar = (user, size = 60) => {
    if (user.avatar) {
      return <Image source={{ uri: user.avatar }} style={[styles.podiumAvatar, { width: size, height: size, borderRadius: size / 2 }]} />;
    }
    return (
      <View style={[styles.avatarPlaceholder, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={[styles.avatarInitials, { fontSize: size / 2.5 }]}>{getInitials(user.name)}</Text>
      </View>
    );
  };

  const renderTopThree = () => {
    const topThree = leaderboardData.slice(0, 3);

    return (
      <View style={styles.podiumContainer}>
        {/* Second Place */}
        <View style={[styles.podiumPosition, styles.secondPlace]}>
          {renderAvatar(topThree[1], 60)}
          <Text style={styles.podiumBadge}>{topThree[1].badge}</Text>
          <Text style={styles.podiumName}>{topThree[1].name.split(' ')[0]}</Text>
          <Text style={styles.podiumTrees}>{topThree[1].trees} pohon</Text>
          <View style={[styles.podiumBase, styles.secondPlaceBase]} />
          <Text style={styles.podiumRank}>2</Text>
        </View>

        {/* First Place */}
        <View style={[styles.podiumPosition, styles.firstPlace]}>
          {renderAvatar(topThree[0], 60)}
          <Text style={styles.podiumBadge}>{topThree[0].badge}</Text>
          <Text style={styles.podiumName}>{topThree[0].name.split(' ')[0]}</Text>
          <Text style={styles.podiumTrees}>{topThree[0].trees} pohon</Text>
          <View style={[styles.podiumBase, styles.firstPlaceBase]} />
          <Text style={styles.podiumRank}>1</Text>
        </View>

        {/* Third Place */}
        <View style={[styles.podiumPosition, styles.thirdPlace]}>
          {renderAvatar(topThree[2], 60)}
          <Text style={styles.podiumBadge}>{topThree[2].badge}</Text>
          <Text style={styles.podiumName}>{topThree[2].name.split(' ')[0]}</Text>
          <Text style={styles.podiumTrees}>{topThree[2].trees} pohon</Text>
          <View style={[styles.podiumBase, styles.thirdPlaceBase]} />
          <Text style={styles.podiumRank}>3</Text>
        </View>
      </View>
    );
  };

  const renderLeaderboardItem = (user) => (
    <TouchableOpacity
      key={user.id}
      style={[
        styles.leaderboardItem,
        user.isCurrentUser && styles.currentUserItem
      ]}
    >
      <View style={styles.rankContainer}>
        <Text style={[
          styles.rankNumber,
          user.isCurrentUser && styles.currentUserRank
        ]}>
          {user.rank}
        </Text>
      </View>

      {user.avatar ? (
        <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
      ) : (
        <View style={[styles.userAvatar, styles.avatarPlaceholderSmall]}>
          <Text style={styles.avatarInitialsSmall}>{getInitials(user.name)}</Text>
        </View>
      )}

      <View style={styles.userInfo}>
        <View style={styles.userNameContainer}>
          <Text style={[
            styles.userName,
            user.isCurrentUser && styles.currentUserName
          ]}>
            {user.name}
          </Text>
          {user.isCurrentUser && <Text style={styles.youLabel}>← You</Text>}
        </View>
        <View style={styles.userStats}>
          <Text style={styles.userTrees}>{user.trees} pohon</Text>
          <Text style={styles.userStreak}>🔥 {user.streak} hari</Text>
        </View>
      </View>

      {user.badge && (
        <Text style={styles.badgeIcon}>{user.badge}</Text>
      )}
    </TouchableOpacity>
  );

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

          <Text style={styles.headerTitle}>Leaderboard Makassar</Text>

          <View style={styles.placeholder} />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {timeFilters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.id && styles.filterButtonActive
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {locationFilters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  selectedLocation === filter.id && styles.filterButtonActive
                ]}
                onPress={() => setSelectedLocation(filter.id)}
              >
                <Text style={[
                  styles.filterText,
                  selectedLocation === filter.id && styles.filterTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Podium */}
        <View style={styles.podiumSection}>
          {renderTopThree()}
        </View>

        {/* Leaderboard List */}
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>Peringkat Lengkap</Text>

          {leaderboardData.slice(3).map(renderLeaderboardItem)}

          {/* Show dots for missing ranks */}
          <View style={styles.dotsContainer}>
            <Text style={styles.dotsText}>...</Text>
          </View>

          {/* Current user if not in top positions */}
          {renderLeaderboardItem(leaderboardData[4])}
        </View>

        {/* Community Contribution */}
        <View style={styles.communitySection}>
          <Text style={styles.sectionTitle}>Kontribusi Komunitas:</Text>

          {communityData.map((community, index) => (
            <TouchableOpacity key={community.id} style={styles.communityItem}>
              <View style={styles.communityRank}>
                <Text style={styles.communityRankText}>{index + 1}</Text>
              </View>

              <Text style={styles.communityIcon}>{community.icon}</Text>

              <View style={styles.communityInfo}>
                <Text style={styles.communityName}>{community.name}</Text>
                <Text style={styles.communityMembers}>
                  {community.members} anggota
                </Text>
              </View>

              <View style={styles.communityTrees}>
                <Text style={styles.communityTreesNumber}>
                  {community.trees.toLocaleString()}
                </Text>
                <Text style={styles.communityTreesLabel}>pohon</Text>
              </View>
            </TouchableOpacity>
          ))}
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

  // Filter Styles
  filtersContainer: {
    gap: SPACING.MARGIN.SM,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE + '20',
    marginRight: SPACING.MARGIN.SM,
  },
  filterButtonActive: {
    backgroundColor: COLORS.WHITE,
  },
  filterText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  filterTextActive: {
    color: COLORS.PRIMARY,
  },

  content: {
    flex: 1,
  },

  // Podium Styles
  podiumSection: {
    padding: SPACING.PADDING.XL,
    backgroundColor: COLORS.WHITE,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 200,
  },
  podiumPosition: {
    alignItems: 'center',
    flex: 1,
  },
  firstPlace: {
    marginBottom: 0,
  },
  secondPlace: {
    marginBottom: 20,
  },
  thirdPlace: {
    marginBottom: 40,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: COLORS.WHITE,
    marginBottom: 8,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.WHITE,
    marginBottom: 8,
  },
  avatarInitials: {
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  avatarPlaceholderSmall: {
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitialsSmall: {
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    fontSize: 16,
  },
  podiumBadge: {
    fontSize: 24,
    marginBottom: 4,
  },
  podiumName: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  podiumTrees: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 12,
  },
  podiumBase: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
  },
  firstPlaceBase: {
    height: 80,
    backgroundColor: '#FFD700',
  },
  secondPlaceBase: {
    height: 60,
    backgroundColor: '#C0C0C0',
  },
  thirdPlaceBase: {
    height: 40,
    backgroundColor: '#CD7F32',
  },
  podiumRank: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Leaderboard Section
  leaderboardSection: {
    padding: SPACING.PADDING.XL,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.LG,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.MD,
    marginBottom: SPACING.MARGIN.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '05',
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.MD,
  },
  rankNumber: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  currentUserRank: {
    color: COLORS.PRIMARY,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: SPACING.MARGIN.MD,
  },
  userInfo: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  currentUserName: {
    color: COLORS.PRIMARY,
  },
  youLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    marginLeft: SPACING.MARGIN.SM,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTrees: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginRight: SPACING.MARGIN.MD,
  },
  userStreak: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_DISABLED,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  badgeIcon: {
    fontSize: 32,
  },
  dotsContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.PADDING.SM,
  },
  dotsText: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.TEXT_DISABLED,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Community Section
  communitySection: {
    padding: SPACING.PADDING.XL,
    backgroundColor: COLORS.WHITE,
  },
  communityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 16,
    padding: SPACING.PADDING.LG,
    marginBottom: SPACING.MARGIN.MD,
  },
  communityRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.MD,
  },
  communityRankText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  communityIcon: {
    fontSize: 32,
    marginRight: SPACING.MARGIN.MD,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  communityMembers: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  communityTrees: {
    alignItems: 'flex-end',
  },
  communityTreesNumber: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  communityTreesLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },

  bottomSpacing: {
    height: 40,
  },
});
