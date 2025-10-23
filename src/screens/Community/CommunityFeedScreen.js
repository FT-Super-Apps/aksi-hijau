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
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../constants/typography';

const { width, height } = Dimensions.get('window');

export default function CommunityFeedScreen({ navigation }) {
  const [likedPosts, setLikedPosts] = useState([1, 3]);
  const [commentText, setCommentText] = useState('');

  const feedPosts = [
    {
      id: 1,
      user: {
        name: 'Budi Santoso',
        avatar: 'https://via.placeholder.com/50x50/4CAF50/FFFFFF?text=BS',
        level: 'Eco Champion',
      },
      timestamp: '2 jam lalu',
      content: 'Hari ini berhasil menanam 5 pohon Mahoni di Taman Hasanuddin bersama komunitas! 🌳 Semoga tumbuh besar dan sehat. Mari kita jaga bumi kita bersama-sama! 💚',
      images: [
        'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Tree+1',
        'https://via.placeholder.com/400x300/45a049/FFFFFF?text=Tree+2',
      ],
      likes: 45,
      comments: 12,
      shares: 3,
      type: 'planting',
      location: 'Taman Hasanuddin, Makassar',
      trees: 5,
      co2: '108 kg',
    },
    {
      id: 2,
      user: {
        name: 'Sari Indah',
        avatar: 'https://via.placeholder.com/50x50/2196F3/FFFFFF?text=SI',
        level: 'Green Warrior',
      },
      timestamp: '5 jam lalu',
      content: 'Challenge Zero Waste Weekend selesai! 🎉 Berhasil mengurangi sampah plastik hingga 80%. Tips: bawa tas belanja sendiri dan gunakan botol minum isi ulang.',
      images: [],
      likes: 67,
      comments: 23,
      shares: 15,
      type: 'challenge',
      challengeName: 'Zero Waste Weekend',
      achievement: '80% reduction',
    },
    {
      id: 3,
      user: {
        name: 'Ahmad Wijaya',
        avatar: 'https://via.placeholder.com/50x50/549B79/FFFFFF?text=AW',
        level: 'Eco Champion',
      },
      timestamp: '1 hari lalu',
      content: 'Yeay! Baru saja dapat badge "Tree Planter" 🌱 Alhamdulillah sudah 25 pohon tertanam. Target selanjutnya: 50 pohon! Siapa mau ikut challenge?',
      images: [
        'https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Badge',
      ],
      likes: 89,
      comments: 34,
      shares: 8,
      type: 'achievement',
      badge: 'Tree Planter',
      totalTrees: 25,
    },
    {
      id: 4,
      user: {
        name: 'Green Community',
        avatar: 'https://via.placeholder.com/50x50/9C27B0/FFFFFF?text=GC',
        level: 'Komunitas',
      },
      timestamp: '2 hari lalu',
      content: 'Event Penanaman Massal di Pantai Losari - Minggu depan! 🌴\n\nYuk gabung:\n📍 Pantai Losari\n📅 Minggu, 1 September 2024\n⏰ 07:00 - 11:00 WITA\n\nBibit disediakan, bawa semangat aja! 💪',
      images: [
        'https://via.placeholder.com/400x200/00BCD4/FFFFFF?text=Event+Poster',
      ],
      likes: 234,
      comments: 78,
      shares: 45,
      type: 'event',
      eventTitle: 'Penanaman Massal Pantai Losari',
      participants: 156,
      targetTrees: 500,
    },
  ];

  const toggleLike = (postId) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const getPostTypeInfo = (post) => {
    const types = {
      planting: { icon: '🌱', label: 'Menanam Pohon', color: COLORS.PRIMARY },
      challenge: { icon: '🎯', label: 'Challenge', color: COLORS.ACCENT },
      achievement: { icon: '🏆', label: 'Pencapaian', color: COLORS.SUCCESS },
      event: { icon: '📅', label: 'Event', color: COLORS.SECONDARY },
    };
    return types[post.type] || types.planting;
  };

  const renderPost = (post) => {
    const isLiked = likedPosts.includes(post.id);
    const typeInfo = getPostTypeInfo(post);

    return (
      <View key={post.id} style={styles.postCard}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <Image source={{ uri: post.user.avatar }} style={styles.userAvatar} />

          <View style={styles.userInfo}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{post.user.name}</Text>
              <View style={[styles.levelBadge, { backgroundColor: typeInfo.color + '15' }]}>
                <Text style={[styles.levelText, { color: typeInfo.color }]}>
                  {post.user.level}
                </Text>
              </View>
            </View>
            <View style={styles.postMeta}>
              <Text style={styles.timestamp}>{post.timestamp}</Text>
              {post.location && (
                <>
                  <Text style={styles.metaDivider}>•</Text>
                  <Text style={styles.location}>📍 {post.location}</Text>
                </>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreIcon}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Post Type Badge */}
        <View style={[styles.typeBadge, { backgroundColor: typeInfo.color + '10' }]}>
          <Text style={styles.typeBadgeIcon}>{typeInfo.icon}</Text>
          <Text style={[styles.typeBadgeText, { color: typeInfo.color }]}>
            {typeInfo.label}
          </Text>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent}>{post.content}</Text>

        {/* Post Images */}
        {post.images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imagesScroll}
          >
            {post.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.postImage} />
            ))}
          </ScrollView>
        )}

        {/* Post Stats */}
        {post.type === 'planting' && (
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🌳</Text>
              <Text style={styles.statText}>{post.trees} pohon</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🌍</Text>
              <Text style={styles.statText}>{post.co2} CO₂</Text>
            </View>
          </View>
        )}

        {post.type === 'event' && (
          <View style={styles.eventCard}>
            <LinearGradient
              colors={[typeInfo.color + '10', typeInfo.color + '05']}
              style={styles.eventGradient}
            >
              <View style={styles.eventRow}>
                <View style={styles.eventStat}>
                  <Text style={styles.eventStatValue}>{post.participants}</Text>
                  <Text style={styles.eventStatLabel}>Peserta</Text>
                </View>
                <View style={styles.eventStat}>
                  <Text style={styles.eventStatValue}>{post.targetTrees}</Text>
                  <Text style={styles.eventStatLabel}>Target Pohon</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.joinEventButton}>
                <Text style={styles.joinEventText}>📝 Daftar Sekarang</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleLike(post.id)}
          >
            <Text style={[styles.actionIcon, isLiked && { color: COLORS.ERROR }]}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={[styles.actionText, isLiked && { color: COLORS.ERROR }]}>
              {post.likes + (isLiked ? 1 : 0)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{post.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🔄</Text>
            <Text style={styles.actionText}>{post.shares}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
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

          <Text style={styles.headerTitle}>Feed Komunitas</Text>

          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationDot} />
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Create Post Button */}
      <View style={styles.createPostSection}>
        <TouchableOpacity style={styles.createPostButton}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40x40/549B79/FFFFFF?text=U' }}
            style={styles.createPostAvatar}
          />
          <Text style={styles.createPostText}>Bagikan aksi hijau Anda...</Text>
          <View style={styles.createPostIcon}>
            <Text style={styles.createPostEmoji}>📸</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <ScrollView
        style={styles.feed}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
      >
        {feedPosts.map(renderPost)}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Camera')}>
        <LinearGradient
          colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
          style={styles.fabGradient}
        >
          <Text style={styles.fabIcon}>🌱</Text>
        </LinearGradient>
      </TouchableOpacity>
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
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE + '20',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.ERROR,
    zIndex: 1,
  },
  notificationIcon: {
    fontSize: 20,
  },

  // Create Post Section
  createPostSection: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.PADDING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 24,
    padding: SPACING.PADDING.MD,
  },
  createPostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.MARGIN.MD,
  },
  createPostText: {
    flex: 1,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  createPostIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPostEmoji: {
    fontSize: 18,
  },

  // Feed
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingTop: SPACING.PADDING.MD,
  },

  // Post Card
  postCard: {
    backgroundColor: COLORS.WHITE,
    marginBottom: SPACING.MARGIN.MD,
    paddingTop: SPACING.PADDING.LG,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.PADDING.LG,
    marginBottom: SPACING.MARGIN.MD,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SPACING.MARGIN.MD,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginRight: SPACING.MARGIN.SM,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  levelText: {
    fontSize: FONT_SIZES.TINY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  metaDivider: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_DISABLED,
    marginHorizontal: 6,
  },
  location: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  moreButton: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 20,
    color: COLORS.TEXT_SECONDARY,
  },

  // Type Badge
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: SPACING.PADDING.LG,
    marginBottom: SPACING.MARGIN.MD,
  },
  typeBadgeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  typeBadgeText: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Post Content
  postContent: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    lineHeight: 22,
    paddingHorizontal: SPACING.PADDING.LG,
    marginBottom: SPACING.MARGIN.MD,
  },

  // Images
  imagesScroll: {
    marginBottom: SPACING.MARGIN.MD,
  },
  postImage: {
    width: width * 0.8,
    height: 240,
    borderRadius: 12,
    marginLeft: SPACING.PADDING.LG,
    marginRight: SPACING.MARGIN.SM,
  },

  // Stats Card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.PRIMARY + '05',
    marginHorizontal: SPACING.PADDING.LG,
    borderRadius: 12,
    padding: SPACING.PADDING.MD,
    marginBottom: SPACING.MARGIN.MD,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  statText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.BORDER,
    marginHorizontal: SPACING.MARGIN.MD,
  },

  // Event Card
  eventCard: {
    marginHorizontal: SPACING.PADDING.LG,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SPACING.MARGIN.MD,
  },
  eventGradient: {
    padding: SPACING.PADDING.LG,
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.MARGIN.MD,
  },
  eventStat: {
    alignItems: 'center',
  },
  eventStatValue: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  eventStatLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  joinEventButton: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    paddingVertical: SPACING.PADDING.MD,
    alignItems: 'center',
  },
  joinEventText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Post Actions
  postActions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.PADDING.LG,
    paddingVertical: SPACING.PADDING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  actionText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 32,
  },

  bottomSpacing: {
    height: 80,
  },
});

