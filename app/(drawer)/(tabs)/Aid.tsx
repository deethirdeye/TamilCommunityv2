import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Linking,
  BackHandler,
  Alert
} from "react-native";
import useTranslation from "@/app/i8n/useTranslationHook";
import { router, useFocusEffect } from "expo-router";
import { t, tailwind } from "react-native-tailwindcss";
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";

const { height } = Dimensions.get('window');

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
}

const Aid = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(
        'https://api.rss2json.com/v1/api.json?rss_url=https://www.thestar.com.my/rss/News'
        //'https://feed2json.org/convert?url=https://www.thestar.com.my/rss/News'
      );

      const data = await response.json();

      if (data.items && Array.isArray(data.items)) {
        const formattedNews: NewsItem[] = data.items.map((item: any) => ({
          id: item.guid,
          title: item.title,
          description: item.description,
          source: 'The Star Malaysia',
          url: item.link,
          publishedAt: new Date(item.pubDate).toLocaleDateString(),
        }));

        setNews(formattedNews);
      }
    } catch (error) {
      console.error('Error fetching RSS:', error);
      setNews([
        {
          id: '1',
          title: 'Unable to load news at the moment',
          description: 'Please check back later',
          source: 'System',
          url: '',
          publishedAt: new Date().toLocaleDateString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  

  const renderNewsSection = () => (
    <View style={[tailwind.p4, styles.newsSection]}>
      <Text style={[tailwind.text2xl, tailwind.fontBold, tailwind.textBlue900, tailwind.mB4]}>
        {t('aid.communityNews')}
      </Text>
      {isLoading ? (
        <View style={[tailwind.p4, tailwind.itemsCenter]}>
          <Text>{t('aid.loadingNews')}</Text>
        </View>
      ) : news.length === 0 ? (
        <View style={[tailwind.p4, tailwind.itemsCenter]}>
          <Text>{t('aid.noNews')}</Text>
        </View>
      ) : (
        news.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[tailwind.p4, tailwind.mB4, styles.newsCard]}
            onPress={() => Linking.openURL(item.url)}
          >
            <Text
              style={[tailwind.textLg, tailwind.fontSemibold, tailwind.textBlue800]}
            >
              {item.title}
            </Text>
            {item.description && (
              <Text
                style={[tailwind.textSm, tailwind.textGray700, tailwind.mT2]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            )}
            <View style={[tailwind.flexRow, tailwind.justifyBetween, tailwind.mT2]}>
              <Text style={[tailwind.textSm, tailwind.textBlue600]}>
                {item.source}
              </Text>
              <Text style={[tailwind.textSm, tailwind.textGray600]}>
                {item.publishedAt}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
 
  const handleBackPress = () => {
    Alert.alert(
      t('exit.title', 'Exit Account'),
      t('exit.message', 'You are about to exit your account. Do you want to continue?'),
      [
        {
          text: t('exit.cancel', 'Cancel'),
          style: 'cancel',
        },
        {
          text: t('exit.confirm', 'Exit'),
          onPress: () => BackHandler.exitApp(),
        },
      ],
      { cancelable: false }
    );
    return true; // Prevent default back button behavior
  };

  // Use `useFocusEffect` to add the back press handler only when this screen is in focus
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      // Clean up the listener when the screen is unfocused
      return () => backHandler.remove();
    }, [])
  );

  
  return (
    <LinearGradient
      colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
      style={[tailwind.flex1]}
    >
      <ScrollView style={[tailwind.flex1]}>
        <View style={[tailwind.pX6, tailwind.mT8]}>{/* Reduced top margin */}
          <Text style={[
            tailwind.text3xl,
            tailwind.fontBold,
            tailwind.textBlue900,
            tailwind.textCenter,
            tailwind.mB6  // Reduced bottom margin
          ]}>
            {t('aid.addressGrievance')}
          </Text>
        </View>
        <View style={[tailwind.pX4, { height: height * 0.25 }]}>{/* Reduced height from 0.375 to 0.25 */}
          <View style={[
            tailwind.flexRow,
            tailwind.justifyAround,
            tailwind.mT4  // Reduced top margin
          ]}>
            <TouchableOpacity
              style={[tailwind.itemsCenter, styles.iconContainer]}
              onPress={() => router.push('../../pages/Aid/Aidforme')}
            >
              <View style={[styles.iconBackground]}>
                <Ionicons name="person" size={32} color="#0369A1" />
              </View>
              <Text style={[
                tailwind.textSm,
                tailwind.fontMedium,
                tailwind.textBlue800,
                tailwind.mT2,
                tailwind.textCenter
              ]}>
                {t('requestAid.myself')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[tailwind.itemsCenter, styles.iconContainer]}
              onPress={() => router.push("../../pages/Aid/AidForSomeone")}
            >
              <View style={[styles.iconBackground]}>
                <Ionicons name="people" size={32} color="#0369A1" />
              </View>
              <Text style={[
                tailwind.textSm,
                tailwind.fontMedium,
                tailwind.textBlue800,
                tailwind.mT2,
                tailwind.textCenter
              ]}>
                {t('requestAid.someoneElse')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[tailwind.itemsCenter, styles.iconContainer]}
              onPress={() => router.push("../../pages/Aid/TrackExpenses")}
            >
              <View style={[styles.iconBackground]}>
                <Ionicons name="document-text" size={32} color="#0369A1" />
              </View>
              <Text style={[
                tailwind.textSm,
                tailwind.fontMedium,
                tailwind.textBlue800,
                tailwind.mT2,
                tailwind.textCenter,
                { width: 100 }  // Fixed width for better text wrapping
              ]}>
                {t('requestAid.trackAidsComplaints')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {renderNewsSection()}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 100,
  },
  iconBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#0369A1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  newsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: height * 0.6,
  },
  newsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    shadowColor: '#0369A1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default Aid;
