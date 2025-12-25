/**
 * CommunityFeedScreen - Feed aktivitas komunitas
 * @module screens/Community/CommunityFeedScreen
 */

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
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { MOCK_COMMUNITY_FEED, MOCK_COMMUNITY_TREES } from '../../store/mockData';
import { useUserStore } from '../../store/userStore';

const { width } = Dimensions.get('window');

export default function CommunityFeedScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('feed');
  const { profile } = useUserStore();

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} hari lalu`;
    if (diffHours > 0) return `${diffHours} jam lalu`;
    return 'Baru saja';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderFeedItem = (item) => (
    <View key={item.id} style={styles.feedItem}>
      {/* User Header */}
      <View style={styles.feedHeader}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitials}>{getInitials(item.userName)}</Text>
        </View>
        <View style={styles.feedUserInfo}>
          <Text style={styles.feedUserName}>{item.userName}</Text>
          <Text style={styles.feedTime}>{formatTimeAgo(item.createdAt)}</Text>
        </View>
        {item.type === 'achievement' && (
          <View style={styles.achievementBadge}>
            <Text style={styles.achievementBadgeText}>🏆</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <Text style={styles.feedContent}>{item.content}</Text>

      {/* Type-specific content */}
      {item.type === 'tree_planted' && (
        <View style={styles.treeCard}>
          <LinearGradient
            colors={[COLORS.PRIMARY + '15', COLORS.PRIMARY + '05']}
            style={styles.treeCardGradient}
          >
            <Text style={styles.treeIcon}>🌳</Text>
            <View style={styles.treeInfo}>
              <Text style={styles.treeName}>{item.treeName}</Text>
              <Text style={styles.treeLocation}>📍 {item.location}</Text>
            </View>
          </LinearGradient>
        </View>
      )}

      {item.type === 'event' && (
        <View style={styles.eventCard}>
          <LinearGradient
            colors={[COLORS.WARNING + '20', COLORS.WARNING + '05']}
            style={styles.eventCardGradient}
          >
            <Text style={styles.eventIcon}>📅</Text>
            <View style={styles.eventInfo}>
              <Text style={styles.eventDate}>
                {new Date(item.eventDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </Text>
              <Text style={styles.eventLocation}>📍 {item.eventLocation}</Text>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Actions */}
      <View style={styles.feedActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={[styles.actionIcon, item.isLiked && styles.actionIconActive]}>
            {item.isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.actionCount}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{item.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTreeActivity = (tree) => (
    <View key={tree.id} style={styles.activityItem}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarInitials}>{getInitials(tree.userName)}</Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>
          <Text style={styles.activityUserName}>{tree.userName}</Text>
          {' menanam '}
          <Text style={styles.activityTreeName}>{tree.typeName}</Text>
        </Text>
        <Text style={styles.activityLocation}>📍 {tree.location.name}</Text>
        <Text style={styles.activityTime}>{formatTimeAgo(tree.createdAt)}</Text>
      </View>
      <Text style={styles.activityTreeIcon}>🌳</Text>
    </View>
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

          <Text style={styles.headerTitle}>Komunitas</Text>

          <TouchableOpacity style={styles.notifButton}>
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'feed' && styles.tabButtonActive]}
            onPress={() => setSelectedTab('feed')}
          >
            <Text style={[styles.tabText, selectedTab === 'feed' && styles.tabTextActive]}>
              Feed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'activity' && styles.tabButtonActive]}
            onPress={() => setSelectedTab('activity')}
          >
            <Text style={[styles.tabText, selectedTab === 'activity' && styles.tabTextActive]}>
              Aktivitas
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY]}
          />
        }
      >
        {selectedTab === 'feed' ? (
          <>
            {/* Create Post Card */}
            <TouchableOpacity style={styles.createPostCard}>
              <View style={styles.createPostAvatar}>
                <Text style={styles.createPostAvatarText}>
                  {profile.name ? getInitials(profile.name) : '👤'}
                </Text>
              </View>
              <Text style={styles.createPostText}>Bagikan aksi hijaumu...</Text>
              <Text style={styles.createPostIcon}>📷</Text>
            </TouchableOpacity>

            {/* Feed Items */}
            {MOCK_COMMUNITY_FEED.map(renderFeedItem)}
          </>
        ) : (
          <>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Aktivitas Terbaru</Text>
              <Text style={styles.activitySubtitle}>Pohon yang ditanam komunitas</Text>
            </View>

            {MOCK_COMMUNITY_TREES.map(renderTreeActivity)}
          </>
        )}

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

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingBottom: SPACING.PADDING.MD,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.MARGIN.MD,
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
  },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifIcon: {
    fontSize: 20,
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE + '15',
    borderRadius: 25,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: COLORS.WHITE,
  },
  tabText: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  tabTextActive: {
    color: COLORS.PRIMARY,
  },

  // Content
  content: {
    flex: 1,
    padding: SPACING.PADDING.LG,
  },

  // Create Post
  createPostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.LG,
    marginBottom: SPACING.MARGIN.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  createPostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.MD,
  },
  createPostAvatarText: {
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    fontSize: FONT_SIZES.REGULAR,
  },
  createPostText: {
    flex: 1,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_DISABLED,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  createPostIcon: {
    fontSize: 24,
  },

  // Feed Item
  feedItem: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.LG,
    marginBottom: SPACING.MARGIN.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.MD,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.MD,
  },
  avatarInitials: {
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    fontSize: FONT_SIZES.REGULAR,
  },
  feedUserInfo: {
    flex: 1,
  },
  feedUserName: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  feedTime: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  achievementBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.WARNING + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementBadgeText: {
    fontSize: 16,
  },
  feedContent: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    lineHeight: 22,
    marginBottom: SPACING.MARGIN.MD,
  },

  // Tree Card
  treeCard: {
    marginBottom: SPACING.MARGIN.MD,
    borderRadius: 12,
    overflow: 'hidden',
  },
  treeCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.PADDING.MD,
  },
  treeIcon: {
    fontSize: 32,
    marginRight: SPACING.MARGIN.MD,
  },
  treeInfo: {
    flex: 1,
  },
  treeName: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.PRIMARY_DARK,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  treeLocation: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 2,
  },

  // Event Card
  eventCard: {
    marginBottom: SPACING.MARGIN.MD,
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.PADDING.MD,
  },
  eventIcon: {
    fontSize: 32,
    marginRight: SPACING.MARGIN.MD,
  },
  eventInfo: {
    flex: 1,
  },
  eventDate: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WARNING_DARK,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  eventLocation: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 2,
  },

  // Actions
  feedActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    paddingTop: SPACING.PADDING.MD,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.XL,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  actionIconActive: {
    transform: [{ scale: 1.1 }],
  },
  actionCount: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },

  // Activity
  activityHeader: {
    marginBottom: SPACING.MARGIN.LG,
  },
  activityTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  activitySubtitle: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.PADDING.MD,
    marginBottom: SPACING.MARGIN.MD,
  },
  activityContent: {
    flex: 1,
    marginLeft: SPACING.MARGIN.SM,
  },
  activityText: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  activityUserName: {
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  activityTreeName: {
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  activityLocation: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 2,
  },
  activityTime: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_DISABLED,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 2,
  },
  activityTreeIcon: {
    fontSize: 28,
    marginLeft: SPACING.MARGIN.SM,
  },

  bottomSpacing: {
    height: 80,
  },
});
