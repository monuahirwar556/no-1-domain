'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  Maximize2,
  Minimize2,
  Radio,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react'
import { formatINR } from '@/lib/utils'

export type DataFastPeriodType =
  | 'today'
  | 'yesterday'
  | 'last24h'
  | 'last7d'
  | 'last30d'
  | 'weekToDate'
  | 'monthToDate'

export const PERIOD_ITEMS: {
  id: DataFastPeriodType
  labelKey:
    | 'periodToday'
    | 'periodYesterday'
    | 'periodLast24h'
    | 'periodLast7d'
    | 'periodLast30d'
    | 'periodWeekToDate'
    | 'periodMonthToDate'
  shortcut?: string
}[] = [
  { id: 'today', labelKey: 'periodToday', shortcut: 'T' },
  { id: 'yesterday', labelKey: 'periodYesterday', shortcut: 'Y' },
  { id: 'last24h', labelKey: 'periodLast24h', shortcut: 'D' },
  { id: 'last7d', labelKey: 'periodLast7d', shortcut: 'W' },
  { id: 'last30d', labelKey: 'periodLast30d', shortcut: '3' },
  { id: 'weekToDate', labelKey: 'periodWeekToDate' },
  { id: 'monthToDate', labelKey: 'periodMonthToDate' },
]

export interface DomainTrackingItem {
  id: string
  rank: number
  title: string
  domain: string
  websiteUrl: string
  description?: string
  category?: string
  currentBid: number
  clicks: number
  imageUrl?: string
  status?: string
  isDemo?: boolean
}

interface TrackingDashboardProps {
  isOpen: boolean
  onClose: () => void
  domains: DomainTrackingItem[]
  selectedDomainId: string | null
  onSelectDomain: (id: string) => void
  trackingDetails: any
  trackingLoading: boolean
  lang: 'en' | 'hi' | 'hinglish'
  isDark: boolean
  minBidForTop1?: number
  onClaimFirstSpot?: () => void
  siteLiveOnlineCount?: number
  isEmbedded?: boolean
}

export const trackingTranslations = {
  en: {
    backToMarketplace: 'Back to Marketplace',
    fullScreenView: 'Full Screen',
    windowView: 'Window View',
    domainAnalytics: 'Domain Analytics',
    liveBoardAnalytics: 'Live Board Analytics',
    liveNowBadge: 'LIVE NOW',
    dataFastEngine: 'DataFast Engine',
    headerSubtitle: 'Real-time traffic & revenue attribution • NO. 1 DOMAIN',
    period24h: 'Last 24h',
    period7d: 'Last 7d',
    period30d: 'Last 30d',
    periodAll: 'All Time',
    periodToday: 'Today',
    periodYesterday: 'Yesterday',
    periodLast24h: 'Last 24 hours',
    periodLast7d: 'Last 7 days',
    periodLast30d: 'Last 30 days',
    periodWeekToDate: 'Week to date',
    periodMonthToDate: 'Month to date',
    currentTime: 'Current time:',
    conversionRate: 'Conversion rate',
    yesterdayLabel: 'Yesterday',
    domainToInspect: 'Domain to Inspect:',
    visitsCount: 'visits',
    uniqueVisitors: 'Unique Visitors',
    uniqueVisitorsSub: '78% unique',
    totalViews: 'Total Views',
    totalViewsSub: '2.2 views / visitor',
    avgDuration: 'Avg Duration',
    avgDurationSub: 'Engaged traffic',
    bounceRate: 'Bounce Rate',
    bounceRateSub: 'Low drop-off',
    spotlightBid: 'Spotlight Bid',
    rankPrefix: 'Rank #',
    tabAll: '📊 All Analytics',
    tabLive: '🟢 Live Online & Stay Duration',
    tabChart: '📈 24h Traffic Chart',
    tabPaths: '📄 Top Pages (Paths)',
    tabLocations: '🌐 Locations (Countries/Cities)',
    tabSources: '🚀 Acquisition Sources',
    tabSystems: '💻 Systems & Devices',
    tabEvents: '🎯 Conversions & Goals',
    tabStream: '⚡ Live Stream',
    liveCardTitle: '🟢 LIVE ONLINE VISITORS & ENGAGEMENT STOPWATCH',
    liveCardSub: 'Track active visitors, target websites visited, and real-time dwell duration on every domain.',
    liveHeartbeat: 'Live Heartbeat (3s)',
    activeNowHeader: 'ACTIVE ONLINE RIGHT NOW:',
    onlineBadge: 'ONLINE',
    stayDurationLabel: 'Stay Duration:',
    colCustomerArrival: '👤 Customer Arrival & Location',
    colTotalStay: '⏱️ Total Stay Duration',
    colTargetDomain: '🌐 Target Domain (Visited Website)',
    colTargetDwell: '⏳ Target Dwell Time',
    colLiveTracking: '🟢 Live Tracking',
    totalStaySub: 'Stayed continuously',
    targetDwellSub: 'Spent on website',
    liveBadge: 'ONLINE',
    departedBadge: 'LEFT',
    colDepCustomer: '👤 Customer Arrival',
    colDepTotalStay: '⏱️ Total Stay',
    colDepTargetDomain: '🌐 Target Domain',
    colDepTargetDwell: '⏳ Target Dwell',
    colDepStatus: 'Status',
    directoryLabel: 'no1domain.in',
    activeEmptyTitle: '🟢 Live Session Tracker Active: Click any link or "Visit" to see customer online in real time!',
    activeEmptySub: 'Real-time visitor sessions and stay duration update automatically.',
    departedHeader: 'RECENT DEPARTED & TOTAL STAY DURATION:',
    stayedLabel: 'Stayed:',
    hourlyChartTitle: 'Hourly Traffic Pattern (CardAnalyticsMain)',
    hourly24hDist: '24-Hour Distribution',
    hourlyIntensity: 'Traffic Intensity',
    peakLabel: '12:00 (Peak)',
    pillChannel: 'Channel',
    pillReferrer: 'Referrer',
    pillCampaign: 'Campaign',
    allLabel: 'All',
    longestStayCenter: '🏆 Longest Stay',
    dwellRankPrefix: 'Dwell Rank #',
    longestStayBadge: '🏆 Longest Stay',
    longestStaySub: '(🔥 Longest Stay!)',
    clickSliceHint: 'Click any slice to switch',
    detailsToggleShow: 'Show All Channels & Stay Times',
    detailsToggleHide: 'Hide',
    detailsBtn: '⛶ DETAILS',
    channelSourceCol: 'Channel / Traffic Source',
    dwellVisitsCol: 'Dwell Time & Visits',
    pillHostname: 'Hostname',
    pillPage: 'Page',
    pillEntryPage: 'Entry page',
    pillExitLink: 'Exit link',
    pageClickInspectHint: '👆 Click any page/link to see dwell duration!',
    dwellDetailsTitle: '⏱️ Dwell Time Details:',
    dwellDetailsMsg: 'Visitors stayed on this page/link for an average of',
    dwellDetailsTopMsg: 'This is the most engaging link on the entire website! 🏆',
    locationsTitle: 'Locations',
    pillCountry: 'Country',
    pillRegion: 'Region',
    pillCity: 'City',
    showAllCountries: '⛶ DETAILS (All Countries)',
    showLess: 'Show Less',
    systemsTitle: 'Systems & Devices',
    pillBrowser: 'Browser',
    pillOS: 'OS',
    pillDevice: 'Device',
    goalsTitle: 'Goals & Conversions (CardAnalyticsCustomEvent)',
    triggeredLabel: 'TRIGGERED',
    streamTitle: 'Recent Live Visitor Stream',
    autoUpdating: 'Auto-Updating (2s)',
    syncingStream: 'Syncing live visitor stream...',
    noVisitsYet: 'No visits recorded yet for this domain.',
    testHint: 'Live visits will be displayed here automatically as visitors arrive.',
    timeJustNow: 'Just now',
    timeSecAgo: 's ago',
    timeMinAgo: 'm ago',
    timeHourAgo: 'h ago',
    timeRecently: 'Recently',
    emptyBoardTitle: '0 Domains on Board Currently',
    emptyBoardDesc: 'Add your domain first (just ₹50) to start tracking live visitors, clicks and DataFast analytics!',
    claimSpotlightFirst: 'Claim First Spot for ₹50',
    deviceMobile: '📱 Mobile',
    deviceDesktop: '💻 Desktop',
    deviceTablet: '📟 Tablet',
    browsingCategory: 'Browsing category:',
    directChannel: 'Direct',
    organicSocialChannel: 'Organic social',
    organicSearchChannel: 'Organic search',
    referralChannel: 'Referral',
  },
  hi: {
    backToMarketplace: '← वापस मार्केटप्लेस',
    fullScreenView: 'फुल स्क्रीन',
    windowView: 'विंडो व्यू',
    domainAnalytics: 'डोमेन एनालिटिक्स',
    liveBoardAnalytics: 'लाइव बोर्ड एनालिटिक्स',
    liveNowBadge: 'लाइव ऑनलाइन',
    dataFastEngine: 'DataFast इंजन',
    headerSubtitle: 'रीयल-टाइम ट्रैफ़िक और विज़िटर विश्लेषण • NO. 1 DOMAIN',
    period24h: 'पिछले 24 घंटे',
    period7d: 'पिछले 7 दिन',
    period30d: 'पिछले 30 दिन',
    periodAll: 'सभी समय',
    periodToday: 'Today (आज)',
    periodYesterday: 'Yesterday (कल)',
    periodLast24h: 'Last 24 hours (24 घंटे)',
    periodLast7d: 'Last 7 days (7 दिन)',
    periodLast30d: 'Last 30 days (30 दिन)',
    periodWeekToDate: 'Week to date (इस हफ़्ते)',
    periodMonthToDate: 'Month to date (इस महीने)',
    currentTime: 'वर्तमान समय:',
    conversionRate: 'कन्वर्जन रेट',
    yesterdayLabel: 'कल (Yesterday)',
    domainToInspect: 'विश्लेषण के लिए डोमेन चुनें:',
    visitsCount: 'विज़िट',
    uniqueVisitors: 'यूनिक विज़िटर्स',
    uniqueVisitorsSub: '78% नए विज़िटर्स',
    totalViews: 'कुल व्यूज़',
    totalViewsSub: '2.2 व्यूज़ / विज़िटर',
    avgDuration: 'औसत रुकने का समय',
    avgDurationSub: 'सक्रिय ट्रैफ़िक',
    bounceRate: 'बाउंस रेट',
    bounceRateSub: 'कम ड्रॉप-ऑफ',
    spotlightBid: 'स्पॉटलाइट बोली',
    rankPrefix: 'रैंक #',
    tabAll: '📊 संपूर्ण विश्लेषण (All Analytics)',
    tabLive: '🟢 लाइव ऑनलाइन और रुकने का समय',
    tabChart: '📈 24 घंटे का ट्रैफ़िक चार्ट',
    tabPaths: '📄 मुख्य पेज (Paths)',
    tabLocations: '🌐 लोकेशन (देश / शहर)',
    tabSources: '🚀 ट्रैफ़िक स्रोत (Acquisition)',
    tabSystems: '💻 सिस्टम और डिवाइस',
    tabEvents: '🎯 रूपांतरण एवं लक्ष्य (Goals)',
    tabStream: '⚡ लाइव विज़िटर स्ट्रीम',
    liveCardTitle: '🟢 लाइव ऑनलाइन ग्राहक एवं रुकने का समय (स्टॉपवॉच)',
    liveCardSub: 'वेबसाइट के किसी भी लिंक पर ग्राहक कितनी देर रुका, अभी लाइव ऑनलाइन है या नहीं — रीयल-टाइम स्टॉपवॉच!',
    liveHeartbeat: 'लाइव धड़कन (3s)',
    activeNowHeader: 'अभी वेबसाइट पर मौजूद हैं (सक्रिय विज़िटर):',
    onlineBadge: 'ऑनलाइन',
    stayDurationLabel: 'कितनी देर रुका:',
    colCustomerArrival: '👤 ग्राहक आगमन एवं स्थान (Arrival & Location)',
    colTotalStay: '⏱️ कुल रुकने का समय (Total Stay)',
    colTargetDomain: '🌐 किस वेबसाइट पर गया (Target Domain)',
    colTargetDwell: '⏳ वेबसाइट पर रुकने का समय (Target Dwell)',
    colLiveTracking: '🟢 लाइव ट्रैकिंग',
    totalStaySub: 'लगातार सक्रिय है',
    targetDwellSub: 'इस वेबसाइट पर रुका',
    liveBadge: 'ऑनलाइन',
    departedBadge: 'छोड़ दिया',
    colDepCustomer: '👤 ग्राहक आगमन',
    colDepTotalStay: '⏱️ कुल समय',
    colDepTargetDomain: '🌐 किस वेबसाइट पर गया',
    colDepTargetDwell: '⏳ वेबसाइट पर रुका',
    colDepStatus: 'स्थिति',
    directoryLabel: 'no1domain.in',
    activeEmptyTitle: '🟢 लाइव सेशन ट्रैकर सक्रिय: किसी भी लिंक या "देखें" पर क्लिक करते ही ग्राहक यहां तुरंत ऑनलाइन दिखेगा!',
    activeEmptySub: 'नीचे "लाइव विज़िट सिमुलेट करें" या टेस्ट लिंक पर क्लिक करके तुरंत लाइव काउंटर टेस्ट करें।',
    departedHeader: 'हाल ही में वेबसाइट छोड़ी (कुल रुकने का समय):',
    stayedLabel: 'रुका था:',
    hourlyChartTitle: 'प्रति घंटे ट्रैफ़िक पैटर्न (CardAnalyticsMain)',
    hourly24hDist: '24 घंटे का वितरण',
    hourlyIntensity: 'ट्रैफ़िक तीव्रता',
    peakLabel: '12:00 (उच्चतम)',
    pillChannel: 'चैनल',
    pillReferrer: 'रेफ़रर (स्रोत)',
    pillCampaign: 'अभियान (कैंपेन)',
    allLabel: 'सभी',
    longestStayCenter: '🏆 सबसे ज़्यादा देर',
    dwellRankPrefix: 'रुकने की रैंक #',
    longestStayBadge: '🏆 सबसे ज़्यादा समय',
    longestStaySub: '(🔥 सबसे ज़्यादा देर!)',
    clickSliceHint: 'बदलने के लिए किसी भी हिस्से पर क्लिक करें',
    detailsToggleShow: 'सभी चैनल और रुकने का समय देखें',
    detailsToggleHide: 'छुपाएं',
    detailsBtn: '⛶ विस्तृत विवरण',
    channelSourceCol: 'चैनल / ट्रैफ़िक स्रोत',
    dwellVisitsCol: 'रुकने का समय और विज़िट',
    pillHostname: 'होस्टनेम',
    pillPage: 'पेज',
    pillEntryPage: 'प्रवेश पेज',
    pillExitLink: 'निकास लिंक',
    pageClickInspectHint: '👆 किसी भी पेज/लिंक पर क्लिक करके देखें ग्राहक उस पर कितनी देर रुका!',
    dwellDetailsTitle: '⏱️ रुकने के समय का विवरण:',
    dwellDetailsMsg: 'इस पेज/लिंक पर ग्राहक औसतन इतने समय तक रुका:',
    dwellDetailsTopMsg: 'यह पूरी वेबसाइट में सबसे अधिक ध्यान आकर्षित करने वाला लिंक है! 🏆',
    locationsTitle: 'विज़िटर लोकेशन',
    pillCountry: 'देश',
    pillRegion: 'राज्य / क्षेत्र',
    pillCity: 'शहर',
    showAllCountries: '⛶ विस्तृत विवरण (सभी देश)',
    showLess: 'कम दिखाएं',
    systemsTitle: 'सिस्टम और डिवाइस',
    pillBrowser: 'ब्राउज़र',
    pillOS: 'ऑपरेटिंग सिस्टम',
    pillDevice: 'डिवाइस',
    goalsTitle: 'रूपांतरण और लक्ष्य (Goals & Conversions)',
    triggeredLabel: 'सक्रिय हुए',
    streamTitle: 'हालिया लाइव विज़िटर स्ट्रीम',
    autoUpdating: 'स्वचालित अपडेट (2s)',
    syncingStream: 'लाइव विज़िटर स्ट्रीम लोड हो रही है...',
    noVisitsYet: 'इस डोमेन के लिए अभी कोई विज़िट दर्ज नहीं हुई है।',
    testHint: 'उपयोगकर्ताओं द्वारा विज़िट करने पर लाइव डेटा यहाँ स्वचालित रूप से दिखाई देगा।',
    timeJustNow: 'अभी-अभी',
    timeSecAgo: 'से. पहले',
    timeMinAgo: 'मि. पहले',
    timeHourAgo: 'घंटे पहले',
    timeRecently: 'हाल ही में',
    emptyBoardTitle: 'बोर्ड पर अभी 0 डोमेन हैं',
    emptyBoardDesc: 'अपना डोमेन सबसे पहले जोड़ें (केवल ₹50 में) ताकि लाइव विज़िटर्स, क्लिक और एनालिटिक्स ट्रैक होना शुरू हो जाएं!',
    claimSpotlightFirst: 'पहला स्थान ₹50 में क्लेम करें',
    deviceMobile: '📱 मोबाइल',
    deviceDesktop: '💻 डेस्कटॉप',
    deviceTablet: '📟 टैबलेट',
    browsingCategory: 'ब्राउज़िंग श्रेणी:',
    directChannel: 'डायरेक्ट',
    organicSocialChannel: 'ऑर्गेनिक सोशल',
    organicSearchChannel: 'ऑर्गेनिक सर्च',
    referralChannel: 'रेफ़रल',
  },
  hinglish: {
    backToMarketplace: '← Wapas Marketplace',
    fullScreenView: 'Full Screen',
    windowView: 'Window View',
    domainAnalytics: 'Domain Analytics',
    liveBoardAnalytics: 'Live Board Analytics',
    liveNowBadge: 'LIVE ONLINE',
    dataFastEngine: 'DataFast Engine',
    headerSubtitle: 'Real-time traffic aur revenue attribution • NO. 1 DOMAIN',
    period24h: 'Pichhle 24h',
    period7d: 'Pichhle 7 Din',
    period30d: 'Pichhle 30 Din',
    periodAll: 'Sabhi Samay',
    periodToday: 'Today',
    periodYesterday: 'Yesterday',
    periodLast24h: 'Last 24 hours',
    periodLast7d: 'Last 7 days',
    periodLast30d: 'Last 30 days',
    periodWeekToDate: 'Week to date',
    periodMonthToDate: 'Month to date',
    currentTime: 'Current time:',
    conversionRate: 'Conversion rate',
    yesterdayLabel: 'Yesterday',
    domainToInspect: 'Domain to Inspect:',
    visitsCount: 'visits',
    uniqueVisitors: 'Unique Visitors',
    uniqueVisitorsSub: '78% unique',
    totalViews: 'Total Views',
    totalViewsSub: '2.2 views / visitor',
    avgDuration: 'Avg Duration (Kitni Der Ruka)',
    avgDurationSub: 'Engaged traffic',
    bounceRate: 'Bounce Rate',
    bounceRateSub: 'Low drop-off',
    spotlightBid: 'Spotlight Bid',
    rankPrefix: 'Rank #',
    tabAll: '📊 All Analytics',
    tabLive: '🟢 Live Online & Kitni Der Ruka',
    tabChart: '📈 24h Traffic Chart',
    tabPaths: '📄 Top Pages (Paths)',
    tabLocations: '🌐 Locations (Desh / Shehar)',
    tabSources: '🚀 Traffic Sources',
    tabSystems: '💻 Systems & Devices',
    tabEvents: '🎯 Goals & Conversions',
    tabStream: '⚡ Live Stream',
    liveCardTitle: '🟢 LIVE ONLINE CUSTOMERS & STAY DURATION (Kitni Der Ruka)',
    liveCardSub: 'Website ke kisi bhi link pe customer kitni der ruka, abhi live online hai ya nahi — Real-Time Stopwatch!',
    liveHeartbeat: 'Live Heartbeat (3s)',
    activeNowHeader: 'ABHI WEBSITE PAR MAUJOOD HAIN (ACTIVE ONLINE):',
    onlineBadge: 'ONLINE',
    stayDurationLabel: 'Kitni Der Ruka:',
    colCustomerArrival: '👤 Customer Aaya (Arrival & Location)',
    colTotalStay: '⏱️ Kitni Der Ruka (Total Stay)',
    colTargetDomain: '🌐 Kis Website Pe Gya (Target Domain)',
    colTargetDwell: '⏳ Uspe Kitni Der Ruka (Target Dwell)',
    colLiveTracking: '🟢 Live Tracking',
    totalStaySub: 'se lagataar ruka hai',
    targetDwellSub: 'us website par ruka',
    liveBadge: 'ONLINE',
    departedBadge: 'LEFT',
    colDepCustomer: '👤 Customer Aaya',
    colDepTotalStay: '⏱️ Kitni Der Ruka',
    colDepTargetDomain: '🌐 Kis Website Pe Gya',
    colDepTargetDwell: '⏳ Uspe Kitni Der Ruka',
    colDepStatus: 'Status',
    directoryLabel: 'no1domain.in',
    activeEmptyTitle: '🟢 Live Session Tracker Active: Kisi bhi link ya "Visit" pe click karte hi customer yahan Online dikhega!',
    activeEmptySub: 'Real-time visitor sessions aur stay duration automatically update hoti rahengi.',
    departedHeader: 'HAAL HI ME WEBSITE CHHODI (RECENT DEPARTED & TOTAL STAY DURATION):',
    stayedLabel: 'Ruka tha:',
    hourlyChartTitle: 'Hourly Traffic Pattern (CardAnalyticsMain)',
    hourly24hDist: '24-Hour Distribution',
    hourlyIntensity: 'Traffic Intensity',
    peakLabel: '12:00 (Peak)',
    pillChannel: 'Channel',
    pillReferrer: 'Referrer',
    pillCampaign: 'Campaign',
    allLabel: 'All',
    longestStayCenter: '🏆 Sabse Zyada Der',
    dwellRankPrefix: 'Dwell Rank #',
    longestStayBadge: '🏆 Sabse Zyada Der',
    longestStaySub: '(🔥 Sabse Zyada Der!)',
    clickSliceHint: 'Click any slice to switch',
    detailsToggleShow: 'Show All Channels & Stay Times',
    detailsToggleHide: 'Hide',
    detailsBtn: '⛶ DETAILS',
    channelSourceCol: 'Channel / Traffic Source',
    dwellVisitsCol: 'Dwell Time & Visits',
    pillHostname: 'Hostname',
    pillPage: 'Page',
    pillEntryPage: 'Entry page',
    pillExitLink: 'Exit link',
    pageClickInspectHint: '👆 Kisi bhi page/link par click karke dekhein customer us par kitni der ruka!',
    dwellDetailsTitle: '⏱️ Dwell Time Details:',
    dwellDetailsMsg: 'Is page/link par customer ausatan itni der ruka:',
    dwellDetailsTopMsg: 'Yeh poori website me sabse zyada attention paane wala link hai! 🏆',
    locationsTitle: 'Locations',
    pillCountry: 'Country',
    pillRegion: 'Region',
    pillCity: 'City',
    showAllCountries: '⛶ DETAILS (All Countries)',
    showLess: 'Show Less',
    systemsTitle: 'Systems & Devices',
    pillBrowser: 'Browser',
    pillOS: 'OS',
    pillDevice: 'Device',
    goalsTitle: 'Goals & Conversions (CardAnalyticsCustomEvent)',
    triggeredLabel: 'TRIGGERED',
    streamTitle: 'Recent Live Visitor Stream',
    autoUpdating: 'Auto-Updating (2s)',
    syncingStream: 'Live visitor stream sync ho rahi hai...',
    noVisitsYet: 'Is domain ke liye abhi koi visits nahi hain.',
    testHint: 'Jab visitors domain par visit karenge to live stream automatically yahan update ho jayegi.',
    timeJustNow: 'Just now',
    timeSecAgo: 's pehle',
    timeMinAgo: 'm pehle',
    timeHourAgo: 'h pehle',
    timeRecently: 'Recently',
    emptyBoardTitle: 'Board Par Abhi 0 Domains Hain',
    emptyBoardDesc: 'Apna domain sabse pehle add karein (sirf ₹50 me) to uske live visitors, clicks aur DataFast analytics track hone lagenge!',
    claimSpotlightFirst: 'Pehla #1 Spot ₹50 me Claim Karein',
    deviceMobile: '📱 Mobile',
    deviceDesktop: '💻 Desktop',
    deviceTablet: '📟 Tablet',
    browsingCategory: 'Browsing category:',
    directChannel: 'Direct',
    organicSocialChannel: 'Organic social',
    organicSearchChannel: 'Organic search',
    referralChannel: 'Referral',
  },
} as const

function getArcSectorPath(cx: number, cy: number, rIn: number, rOut: number, startAngle: number, endAngle: number) {
  let sweep = endAngle - startAngle
  if (sweep < 0) sweep += 360
  const largeArc = sweep > 180 ? 1 : 0
  const rad1 = (startAngle * Math.PI) / 180
  const rad2 = (endAngle * Math.PI) / 180
  const p1OutX = cx + rOut * Math.cos(rad1)
  const p1OutY = cy + rOut * Math.sin(rad1)
  const p2OutX = cx + rOut * Math.cos(rad2)
  const p2OutY = cy + rOut * Math.sin(rad2)
  const p2InX = cx + rIn * Math.cos(rad2)
  const p2InY = cy + rIn * Math.sin(rad2)
  const p1InX = cx + rIn * Math.cos(rad1)
  const p1InY = cy + rIn * Math.sin(rad1)

  return `M ${p1OutX.toFixed(2)} ${p1OutY.toFixed(2)} A ${rOut} ${rOut} 0 ${largeArc} 1 ${p2OutX.toFixed(2)} ${p2OutY.toFixed(2)} L ${p2InX.toFixed(2)} ${p2InY.toFixed(2)} A ${rIn} ${rIn} 0 ${largeArc} 0 ${p1InX.toFixed(2)} ${p1InY.toFixed(2)} Z`
}

export default function TrackingDashboard({
  isOpen,
  onClose,
  domains,
  selectedDomainId,
  onSelectDomain,
  trackingDetails,
  trackingLoading,
  lang,
  isDark,
  minBidForTop1 = 50,
  onClaimFirstSpot,
  siteLiveOnlineCount,
  isEmbedded = false,
}: TrackingDashboardProps) {
  const [isTrackingFullscreen, setIsTrackingFullscreen] = useState(true)
  const [dataFastTab, setDataFastTab] = useState<'all' | 'live_users' | 'chart' | 'paths' | 'locations' | 'sources' | 'systems' | 'events' | 'stream'>('all')
  const [dataFastPeriod, setDataFastPeriod] = useState<DataFastPeriodType>('monthToDate')
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false)
  const periodDropdownRef = useRef<HTMLDivElement>(null)
  const [currentTimeStr, setCurrentTimeStr] = useState('4:38 am')
  const [locationSubTab, setLocationSubTab] = useState<'country' | 'region' | 'city'>('country')
  const [systemSubTab, setSystemSubTab] = useState<'browser' | 'os' | 'device'>('browser')
  const [showAllCountries, setShowAllCountries] = useState(false)
  const [channelPillTab, setChannelPillTab] = useState<'channel' | 'referrer' | 'campaign'>('channel')
  const [pagePillTab, setPagePillTab] = useState<'hostname' | 'page' | 'entry_page' | 'exit_link'>('page')
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)
  const [clickedDonutChannel, setClickedDonutChannel] = useState<string | null>(null)
  const [selectedPageItem, setSelectedPageItem] = useState<any | null>(null)
  const [showChannelDetails, setShowChannelDetails] = useState(false)
  const [chartHoverIndex, setChartHoverIndex] = useState<number | null>(null)
  const [hoveredDonutChannel, setHoveredDonutChannel] = useState<string | null>(null)
  const [donutMousePos, setDonutMousePos] = useState<{ x: number; y: number } | null>(null)
  const [isAllChannelsDropdownOpen, setIsAllChannelsDropdownOpen] = useState(false)
  const channelDropdownRef = useRef<HTMLDivElement>(null)
  const [selectedDrilldownSourceId, setSelectedDrilldownSourceId] = useState<string | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTimeStr(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(e.target as Node)) {
        setIsPeriodDropdownOpen(false)
      }
      if (channelDropdownRef.current && !channelDropdownRef.current.contains(e.target as Node)) {
        setIsAllChannelsDropdownOpen(false)
      }
    }
    if (isPeriodDropdownOpen || isAllChannelsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isPeriodDropdownOpen, isAllChannelsDropdownOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return
      const key = e.key.toLowerCase()
      if (key === 't') setDataFastPeriod('today')
      else if (key === 'y') setDataFastPeriod('yesterday')
      else if (key === 'd') setDataFastPeriod('last24h')
      else if (key === 'w') setDataFastPeriod('last7d')
      else if (key === '3') setDataFastPeriod('last30d')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const tt = trackingTranslations[lang] || trackingTranslations.en
  const activeItem = domains.find((d) => d.id === selectedDomainId) || domains[0]

  const currentActiveVisitors = trackingDetails?.liveOnlineVisitors?.activeVisitors || []
  const activeOnlineCount = (currentActiveVisitors.length > 0)
    ? currentActiveVisitors.length
    : (trackingDetails?.liveOnlineVisitors?.liveOnlineCount ?? siteLiveOnlineCount ?? 1)

  const periodMetrics = useMemo(() => {
    const safeClicks = Math.max(activeItem?.clicks ?? 342, 10)
    switch (dataFastPeriod) {
      case 'today':
        return {
          visitors: Math.max(1, Math.round(safeClicks * 0.28)),
          visitorsFormatted: String(Math.max(1, Math.round(safeClicks * 0.28))),
          visitorsTrend: '12% ↑',
          visitorsTrendUp: true,
          pageviews: Math.round(safeClicks * 0.55),
          bounceRate: '52%',
          bounceTrend: '4% ↓',
          avgDuration: '1m 15s',
          conversionRate: '2.8%',
          chartType: 'hourly' as const,
          timeline: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
          chartPoints: [18, 42, 85, 140, 95, 60, 20],
          defaultIndex: 3,
          pointReports: [
            { label: '00:00 (Night)', visitors: 18, views: 39, duration: '1m 05s', badge: 'Night Owl' },
            { label: '04:00 (Early)', visitors: 42, views: 92, duration: '1m 15s', badge: 'Early Morning' },
            { label: '08:00 (Morning)', visitors: 85, views: 187, duration: '1m 30s', badge: 'Rush Hour' },
            { label: '12:00 (Peak)', visitors: 140, views: 308, duration: '2m 15s', badge: '🔥 Peak Hour' },
            { label: '16:00 (Evening)', visitors: 95, views: 209, duration: '1m 40s', badge: 'Active' },
            { label: '20:00 (Prime)', visitors: 60, views: 132, duration: '1m 20s', badge: 'Prime Time' },
            { label: '23:59 (Current)', visitors: 20, views: 44, duration: '1m 10s', badge: '🟢 Live Now' },
          ],
        }
      case 'yesterday':
        return {
          visitors: 1627,
          visitorsFormatted: '1,627',
          visitorsTrend: '8% ↓',
          visitorsTrendUp: false,
          pageviews: Math.round(safeClicks * 0.72),
          bounceRate: '54%',
          bounceTrend: '2% ↑',
          avgDuration: '1m 20s',
          conversionRate: '3.1%',
          chartType: 'hourly' as const,
          timeline: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
          chartPoints: [120, 280, 710, 1420, 1627, 890, 310],
          defaultIndex: 4,
          pointReports: [
            { label: '00:00 (Night)', visitors: 120, views: 264, duration: '1m 10s', badge: 'Night' },
            { label: '04:00 (Early)', visitors: 280, views: 616, duration: '1m 25s', badge: 'Early' },
            { label: '08:00 (Morning)', visitors: 710, views: 1562, duration: '1m 45s', badge: 'Morning Traffic' },
            { label: '12:00 (Noon)', visitors: 1420, views: 3124, duration: '2m 05s', badge: 'High Engagement' },
            { label: '16:00 (Yesterday)', visitors: 1627, views: 3579, duration: '2m 24s', badge: '🏆 Top Peak' },
            { label: '20:00 (Prime)', visitors: 890, views: 1958, duration: '1m 40s', badge: 'Prime Evening' },
            { label: '23:59 (Close)', visitors: 310, views: 682, duration: '1m 15s', badge: 'Late Night' },
          ],
        }
      case 'last24h':
        return {
          visitors: Math.max(1, Math.round(safeClicks * 0.78)),
          visitorsFormatted: String(Math.max(1, Math.round(safeClicks * 0.78))),
          visitorsTrend: '18% ↑',
          visitorsTrendUp: true,
          pageviews: Math.round(safeClicks * 1.85),
          bounceRate: '48%',
          bounceTrend: '6% ↓',
          avgDuration: '1m 32s',
          conversionRate: '3.4%',
          chartType: 'hourly' as const,
          timeline: ['00:00', '06:00', '12:00', '18:00', '23:59'],
          chartPoints: [85, 240, 890, 560, 210],
          defaultIndex: 2,
          pointReports: [
            { label: '24h ago', visitors: 85, views: 187, duration: '1m 15s', badge: 'Past Cycle' },
            { label: '18h ago', visitors: 240, views: 528, duration: '1m 30s', badge: 'Steady Traffic' },
            { label: '12h ago (Peak)', visitors: 890, views: 1958, duration: '2m 10s', badge: '🔥 24h Peak' },
            { label: '6h ago', visitors: 560, views: 1232, duration: '1m 40s', badge: 'High Activity' },
            { label: 'Just Now', visitors: 210, views: 462, duration: '1m 20s', badge: '🟢 Active Now' },
          ],
        }
      case 'last7d':
        return {
          visitors: Math.max(1, Math.round(safeClicks * 3.4)),
          visitorsFormatted: `${(Math.max(1, Math.round(safeClicks * 3.4)) / 1000).toFixed(1)}k`,
          visitorsTrend: '24% ↑',
          visitorsTrendUp: true,
          pageviews: Math.round(safeClicks * 7.2),
          bounceRate: '55%',
          bounceTrend: '8% ↓',
          avgDuration: '1m 24s',
          conversionRate: '3.0%',
          chartType: 'daily' as const,
          timeline: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          chartPoints: [420, 580, 710, 890, 1140, 1627, 780],
          defaultIndex: 5,
          pointReports: [
            { label: 'Monday', visitors: 420, views: 924, duration: '1m 15s', badge: 'Workday' },
            { label: 'Tuesday', visitors: 580, views: 1276, duration: '1m 22s', badge: 'Normal' },
            { label: 'Wednesday', visitors: 710, views: 1562, duration: '1m 30s', badge: 'Midweek Surge' },
            { label: 'Thursday', visitors: 890, views: 1958, duration: '1m 45s', badge: 'High Dwell' },
            { label: 'Friday', visitors: 1140, views: 2508, duration: '2m 00s', badge: 'Weekend Eve' },
            { label: 'Saturday (Yesterday)', visitors: 1627, views: 3579, duration: '2m 24s', badge: '🏆 Top Day' },
            { label: 'Sunday (Today)', visitors: 780, views: 1716, duration: '1m 35s', badge: '🟢 Active' },
          ],
        }
      case 'weekToDate':
        return {
          visitors: Math.max(1, Math.round(safeClicks * 2.2)),
          visitorsFormatted: `${(Math.max(1, Math.round(safeClicks * 2.2)) / 1000).toFixed(1)}k`,
          visitorsTrend: '19% ↑',
          visitorsTrendUp: true,
          pageviews: Math.round(safeClicks * 4.6),
          bounceRate: '53%',
          bounceTrend: '5% ↓',
          avgDuration: '1m 22s',
          conversionRate: '3.2%',
          chartType: 'daily' as const,
          timeline: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Today'],
          chartPoints: [420, 580, 710, 890, 1627, 940],
          defaultIndex: 4,
          pointReports: [
            { label: 'Monday', visitors: 420, views: 924, duration: '1m 15s', badge: 'Day 1' },
            { label: 'Tuesday', visitors: 580, views: 1276, duration: '1m 20s', badge: 'Day 2' },
            { label: 'Wednesday', visitors: 710, views: 1562, duration: '1m 35s', badge: 'Day 3' },
            { label: 'Thursday', visitors: 890, views: 1958, duration: '1m 50s', badge: 'Day 4' },
            { label: 'Friday (Yesterday)', visitors: 1627, views: 3579, duration: '2m 24s', badge: '🏆 Top Peak' },
            { label: 'Saturday (Today)', visitors: 940, views: 2068, duration: '1m 40s', badge: '🟢 Active' },
          ],
        }
      case 'last30d':
        return {
          visitors: Math.max(1, Math.round(safeClicks * 14.2)),
          visitorsFormatted: `${(Math.max(1, Math.round(safeClicks * 14.2)) / 1000).toFixed(1)}k`,
          visitorsTrend: '45% ↑',
          visitorsTrendUp: true,
          pageviews: Math.round(safeClicks * 32.5),
          bounceRate: '56%',
          bounceTrend: '11% ↓',
          avgDuration: '1m 26s',
          conversionRate: '3.5%',
          chartType: 'dates' as const,
          timeline: ['10 Sep', '15 Sep', '20 Sep', '25 Sep', '01 Oct', '05 Oct', 'Today'],
          chartPoints: [1800, 1600, 1300, 950, 1450, 1627, 410],
          defaultIndex: 5,
          pointReports: [
            { label: '10 Sep', visitors: 1800, views: 3960, duration: '1m 50s', badge: 'High Volume' },
            { label: '15 Sep', visitors: 1600, views: 3520, duration: '1m 45s', badge: 'Steady' },
            { label: '20 Sep', visitors: 1300, views: 2860, duration: '1m 40s', badge: 'Normal' },
            { label: '25 Sep', visitors: 950, views: 2090, duration: '1m 30s', badge: 'Downturn' },
            { label: '01 Oct', visitors: 1450, views: 3190, duration: '1m 55s', badge: 'Rebound' },
            { label: '05 Oct (Yesterday)', visitors: 1627, views: 3579, duration: '2m 24s', badge: '🏆 30d Peak' },
            { label: 'Today', visitors: 410, views: 902, duration: '1m 20s', badge: '🟢 Today' },
          ],
        }
      case 'monthToDate':
      default:
        return {
          visitors: 13800,
          visitorsFormatted: '13.8k',
          visitorsTrend: '81% ↓',
          visitorsTrendUp: false,
          pageviews: 29500,
          bounceRate: '57%',
          bounceTrend: '14% ↓',
          avgDuration: '1m 28s',
          conversionRate: '3.2%',
          chartType: 'dates' as const,
          timeline: ['01 Oct', '05 Oct', 'yesterday'],
          chartPoints: [1850, 1420, 950, 1280, 1420, 1627, 240],
          defaultIndex: 5,
          pointReports: [
            { label: '01 Oct', visitors: 1850, views: 3885, duration: '2m 10s', badge: '🚀 Month Start' },
            { label: '03 Oct', visitors: 1420, views: 2982, duration: '1m 50s', badge: 'Active Traffic' },
            { label: '05 Oct', visitors: 950, views: 1995, duration: '1m 35s', badge: 'Weekend Dip' },
            { label: '07 Oct', visitors: 1280, views: 2688, duration: '1m 45s', badge: 'Growth Surge' },
            { label: '08 Oct', visitors: 1420, views: 2982, duration: '1m 55s', badge: 'Strong Dwell' },
            { label: 'Yesterday', visitors: 1627, views: 3416, duration: '2m 24s', badge: '🏆 Top Engagement' },
            { label: 'Today (Live)', visitors: 240, views: 504, duration: '1m 15s', badge: '🟢 Live Online' },
          ],
        }
    }
  }, [dataFastPeriod, activeItem?.clicks])

  const renderDateRangePicker = (isHero = false) => {
    const currentOpt = PERIOD_ITEMS.find((p) => p.id === dataFastPeriod) || PERIOD_ITEMS[6]
    const currentLabel = (tt as any)[currentOpt.labelKey] || currentOpt.id
    const currentIndex = PERIOD_ITEMS.findIndex((p) => p.id === dataFastPeriod)

    const handlePrev = () => {
      const prevIdx = (currentIndex - 1 + PERIOD_ITEMS.length) % PERIOD_ITEMS.length
      setDataFastPeriod(PERIOD_ITEMS[prevIdx].id)
    }

    const handleNext = () => {
      const nextIdx = (currentIndex + 1) % PERIOD_ITEMS.length
      setDataFastPeriod(PERIOD_ITEMS[nextIdx].id)
    }

    return (
      <div className={`relative inline-flex items-center ${isHero ? 'my-3' : ''}`}>
        <div
          className={`inline-flex items-center rounded-2xl border shadow-sm transition-all ${
            isHero
              ? isDark
                ? 'bg-[#121322] border-zinc-700/80 p-1'
                : 'bg-white border-slate-300 p-1 shadow-sm'
              : isDark
              ? 'bg-[#0e0f1c] border-zinc-800 p-0.5'
              : 'bg-white border-slate-300 p-0.5'
          }`}
        >
          <button
            type="button"
            onClick={handlePrev}
            className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer ${
              isDark ? 'hover:bg-white/10 text-zinc-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
            title="Previous Period"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              isDark ? 'text-white hover:bg-white/5' : 'text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>{currentLabel}</span>
            {isPeriodDropdownOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer ${
              isDark ? 'hover:bg-white/10 text-zinc-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
            title="Next Period"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {isPeriodDropdownOpen && (
          <div
            ref={periodDropdownRef}
            className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 w-64 sm:w-72 rounded-3xl border shadow-2xl p-2.5 backdrop-blur-xl animate-in zoom-in-95 ${
              isDark
                ? 'bg-[#151624]/98 border-zinc-700/80 text-white shadow-black/80'
                : 'bg-white/98 border-slate-200 text-slate-900 shadow-slate-300/60'
            }`}
          >
            <div className="px-3.5 py-2 text-[11px] font-medium text-zinc-400 flex items-center justify-between border-b border-zinc-800/40 mb-1">
              <span>{tt.currentTime || 'Current time:'} {currentTimeStr}</span>
            </div>

            <div className="space-y-1">
              {PERIOD_ITEMS.map((opt) => {
                const isSelected = dataFastPeriod === opt.id
                const label = (tt as any)[opt.labelKey] || opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setDataFastPeriod(opt.id)
                      setIsPeriodDropdownOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-[#222432] text-white shadow-md'
                          : 'bg-slate-900 text-white shadow-md'
                        : isDark
                        ? 'text-zinc-300 hover:bg-white/5 hover:text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <span className={isSelected ? 'font-black' : 'font-medium'}>{label}</span>
                    {opt.shortcut && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border ${
                          isSelected
                            ? 'bg-white/10 text-white border-white/20'
                            : isDark
                            ? 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {opt.shortcut}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  const getChanName = (id: string, name: string) => {
    if (id === 'direct') return tt.directChannel
    if (id === 'organic_social') return tt.organicSocialChannel
    if (id === 'organic_search') return tt.organicSearchChannel
    if (id === 'referral') return tt.referralChannel
    return name
  }

  if (!isOpen && !isEmbedded) return null

  const dashboardCard = (
    <div
      className={`w-full overflow-y-auto flex flex-col ${
        isEmbedded
          ? 'rounded-3xl border border-purple-500/25 shadow-2xl overflow-hidden'
          : isTrackingFullscreen
          ? 'min-h-screen rounded-none border-0'
          : 'max-w-4xl sm:max-w-5xl max-h-[94vh] rounded-3xl shadow-2xl border-2 border-cyan-500/40 overflow-hidden'
      } ${isDark ? 'bg-[#0d0e19] text-slate-100' : 'bg-white text-slate-900'}`}
    >
      {/* Sticky Header Bar */}
      <div
        className={`sticky top-0 z-30 p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b shadow-md backdrop-blur-md ${
          isDark ? 'bg-[#111224]/95 border-cyan-500/25' : 'bg-slate-50/95 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 w-full sm:w-auto">
          {/* Back to Marketplace Button */}
          {!isEmbedded && (
            <button
              type="button"
              onClick={onClose}
              id="back-to-marketplace-btn"
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 shadow-sm ${
                isDark
                  ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  : 'bg-[#f0fdfa] hover:bg-[#e0f2fe] text-[#0369a1] border-[#38bdf8] font-black'
              }`}
              style={!isDark ? { color: '#0369a1', borderColor: '#38bdf8', backgroundColor: '#f0fdfa' } : undefined}
              title={tt.backToMarketplace}
            >
              <ArrowLeft className={`w-4 h-4 stroke-[2.5] ${isDark ? 'text-cyan-300' : 'text-[#0369a1]'}`} style={!isDark ? { color: '#0369a1' } : undefined} />
              <span className={`font-black text-xs ${isDark ? 'text-cyan-300' : 'text-[#0369a1]'}`} style={!isDark ? { color: '#0369a1' } : undefined}>{tt.backToMarketplace}</span>
            </button>
          )}

          {isEmbedded && (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.35)] flex-shrink-0">
              <Globe className="w-5 h-5 text-cyan-400" />
            </div>
          )}

            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.35)] flex-shrink-0 hidden xs:flex">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-sm sm:text-base text-cyan-300 truncate">
                  {activeItem ? activeItem.domain : tt.liveBoardAnalytics}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 animate-pulse flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{activeOnlineCount} {tt.liveNowBadge}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 hidden sm:inline-block">
                  {tt.dataFastEngine}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                {tt.headerSubtitle}
              </p>
            </div>
          </div>

          {/* Fullscreen Toggle & Close Button */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Fullscreen / Window Toggle */}
            <button
              type="button"
              onClick={() => setIsTrackingFullscreen(!isTrackingFullscreen)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'text-zinc-300 hover:text-white hover:bg-white/10 border-white/10'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200 border-slate-300'
              }`}
              title={isTrackingFullscreen ? tt.windowView : tt.fullScreenView}
              aria-label="Toggle Fullscreen"
            >
              {isTrackingFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close analytics modal"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className={`p-4 sm:p-6 lg:p-8 space-y-6 flex-1 ${isTrackingFullscreen ? 'max-w-7xl mx-auto w-full' : ''}`}>
          {domains.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl mx-auto bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Radio className="w-7 h-7 text-cyan-400 animate-pulse" />
              </div>
              <h4 className="font-black text-lg text-yellow-400">{tt.emptyBoardTitle}</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                {tt.emptyBoardDesc}
              </p>
              {onClaimFirstSpot && (
                <button
                  onClick={onClaimFirstSpot}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-yellow-500/25 inline-flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>{tt.claimSpotlightFirst}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Domain Selector & Active Spotlight Summary Header */}
              {activeItem && (
                <div className="space-y-4">
                  {/* Domain Selector Dropdown (if multiple domains) */}
                  {domains.length > 1 && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        {tt.domainToInspect}
                      </label>
                      <select
                        value={selectedDomainId || domains[0].id}
                        onChange={(e) => onSelectDomain(e.target.value)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all flex-1 max-w-md ${
                          isDark ? 'bg-[#141525] border-purple-500/30 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      >
                        {domains.map((d) => (
                          <option key={d.id} value={d.id}>
                            #{d.rank} — {d.title} ({d.domain}) — {d.clicks} {tt.visitsCount}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Centered Date Range Selector Bar matching DataFast Mobile & Desktop */}
                  <div className="flex flex-col items-center justify-center pt-2 pb-1">
                    <div className="text-center">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-1">
                        Active Timeframe Filter
                      </span>
                      {renderDateRangePicker(true)}
                    </div>
                  </div>

                  {/* 5-Executive KPI Cards Bar (Dynamically updated per DataFast timeframe) */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3.5">
                    {/* Visitors */}
                    <div
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        isDark ? 'bg-[#111222] border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-cyan-50/70 border-cyan-200 shadow-xs'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        {tt.uniqueVisitors}
                      </span>
                      <div className="flex items-center justify-center gap-1.5 my-0.5">
                        <strong className="text-xl sm:text-2xl font-black text-cyan-400">
                          {periodMetrics.visitorsFormatted}
                        </strong>
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                            periodMetrics.visitorsTrendUp
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {periodMetrics.visitorsTrend}
                        </span>
                      </div>
                      <small className="text-[10px] text-zinc-400 block font-medium">
                        {dataFastPeriod === 'monthToDate' ? 'Month to date' : dataFastPeriod === 'today' ? 'Live today' : 'Selected period'}
                      </small>
                    </div>

                    {/* Bounce Rate */}
                    <div
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        isDark ? 'bg-[#111222] border-emerald-500/30' : 'bg-emerald-50/70 border-emerald-200 shadow-xs'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        {tt.bounceRate}
                      </span>
                      <div className="flex items-center justify-center gap-1.5 my-0.5">
                        <strong className="text-xl sm:text-2xl font-black text-emerald-400">
                          {periodMetrics.bounceRate}
                        </strong>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {periodMetrics.bounceTrend}
                        </span>
                      </div>
                      <small className="text-[10px] text-zinc-400 block font-medium">
                        {tt.bounceRateSub}
                      </small>
                    </div>

                    {/* Real-time Online Visitors */}
                    <div
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        isDark ? 'bg-[#111222] border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Live Visitors
                      </span>
                      <div className="flex items-center justify-center gap-2 my-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <strong className="text-xl sm:text-2xl font-black text-emerald-400">
                          {activeOnlineCount}
                        </strong>
                        <span className="text-[10px] font-black text-emerald-400 uppercase px-1.5 py-0.5 rounded bg-emerald-500/20">
                          Online
                        </span>
                      </div>
                      <small className="text-[10px] text-emerald-400/90 block font-bold">
                        🟢 Real-time Active
                      </small>
                    </div>

                    {/* Conversion Rate */}
                    <div
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        isDark ? 'bg-[#111222] border-yellow-500/30 shadow-[0_0_15px_rgba(250,204,21,0.1)]' : 'bg-amber-50/70 border-amber-200 shadow-xs'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        {tt.conversionRate || 'Conversion rate'}
                      </span>
                      <strong className="text-xl sm:text-2xl font-black text-yellow-400 block my-0.5">
                        {periodMetrics.conversionRate}
                      </strong>
                      <small className="text-[10px] text-zinc-400 block font-medium">
                        Ad clicks converted
                      </small>
                    </div>

                    {/* Spotlight Tier & Rank */}
                    <div
                      className={`col-span-2 sm:col-span-1 p-3.5 rounded-2xl border text-center transition-all ${
                        isDark ? 'bg-[#111222] border-purple-400/40' : 'bg-purple-50 border-purple-300 shadow-xs'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        {tt.spotlightBid}
                      </span>
                      <strong className="text-xl sm:text-2xl font-black text-purple-300 block my-0.5">
                        {formatINR(activeItem.currentBid)}
                      </strong>
                      <small className="text-[10px] text-purple-400 block font-black">
                        {tt.rankPrefix}{activeItem.rank} {activeItem.rank === 1 && '👑'}
                      </small>
                    </div>
                  </div>

                  {/* Section Navigation Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs font-bold scrollbar-none">
                    {[
                      { key: 'all', label: tt.tabAll },
                      { key: 'live_users', label: tt.tabLive },
                      { key: 'chart', label: tt.tabChart },
                      { key: 'paths', label: tt.tabPaths },
                      { key: 'locations', label: tt.tabLocations },
                      { key: 'sources', label: tt.tabSources },
                      { key: 'systems', label: tt.tabSystems },
                      { key: 'events', label: tt.tabEvents },
                      { key: 'stream', label: tt.tabStream },
                    ].map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setDataFastTab(t.key as any)}
                        className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                          dataFastTab === t.key
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black shadow-md'
                            : isDark
                            ? 'bg-[#141525] text-zinc-300 hover:text-white border border-purple-500/20'
                            : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* REAL-TIME LIVE ONLINE CUSTOMERS & STAY DURATION (Kitni der ruka) */}
              {(dataFastTab === 'all' || dataFastTab === 'live_users') && (
                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isDark
                      ? 'bg-[#101120] border-emerald-500/35 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                      : 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-emerald-500/20">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-black text-emerald-400 tracking-wide">
                            {tt.liveCardTitle}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            {activeOnlineCount} {tt.liveNowBadge}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          {tt.liveCardSub}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {tt.liveHeartbeat}
                      </span>
                    </div>
                  </div>

                  {/* Online Visitors List */}
                  {(() => {
                    const liveVisitors = trackingDetails?.liveOnlineVisitors?.activeVisitors || []
                    const departedVisitors = trackingDetails?.liveOnlineVisitors?.recentDeparted || []

                    return (
                      <div className="space-y-4">
                        {liveVisitors.length > 0 ? (
                          <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                              {tt.activeNowHeader}
                            </span>
                            <div className="overflow-x-auto rounded-xl border border-emerald-500/25">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className={`border-b text-[10px] uppercase font-black tracking-wider ${
                                    isDark ? 'border-zinc-800 text-zinc-400 bg-white/[0.03]' : 'border-slate-200 text-slate-500 bg-slate-100'
                                  }`}>
                                    <th className="py-2.5 px-3">{tt.colCustomerArrival}</th>
                                    <th className="py-2.5 px-3">{tt.colTotalStay}</th>
                                    <th className="py-2.5 px-3">{tt.colTargetDomain}</th>
                                    <th className="py-2.5 px-3">{tt.colTargetDwell}</th>
                                    <th className="py-2.5 px-3 text-right">{tt.colLiveTracking}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/60">
                                  {liveVisitors.map((v: any, idx: number) => {
                                    const isExternal = Boolean(v.isExternal && v.targetDomain && v.targetDomain !== 'no1domain.in' && v.targetDomain !== 'NO. 1 DOMAIN Directory')
                                    const targetDomainName = isExternal ? v.targetDomain : 'no1domain.in'
                                    const targetSub = isExternal ? (v.linkTitle || v.currentUrl || v.targetDomain) : 'no1domain.in (Platform Browsing)'
                                    const targetStay = v.targetDurationFormatted || v.durationFormatted || `${v.durationSeconds || 1}s`

                                    return (
                                      <tr key={v.sessionId || idx} className={`transition-colors ${isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-50'}`}>
                                        <td className="py-2.5 px-3">
                                          <div className="flex items-start gap-2">
                                            <span className="text-lg leading-none select-none mt-0.5">{v.flag || '🇮🇳'}</span>
                                            <div>
                                              <div className="flex items-center gap-1.5 flex-wrap">
                                                <strong className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                  {v.country || 'India'}{v.city ? `, ${v.city}` : ''}
                                                </strong>
                                                {v.arrivalTimeFormatted && (
                                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                                                    🕒 {v.arrivalTimeFormatted}
                                                  </span>
                                                )}
                                              </div>
                                              <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-0.5">
                                                <span className="text-purple-300 font-semibold">{v.device === 'Mobile' ? '📱 Mobile' : '💻 Desktop'}</span>
                                                <span>•</span>
                                                <span className="font-mono text-zinc-500">{v.browser}</span>
                                                <span>•</span>
                                                <span className="font-mono text-zinc-500">{v.maskedIp}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </td>

                                        <td className="py-2.5 px-3">
                                          <div>
                                            <strong className="text-sm font-mono font-black text-amber-300 flex items-center gap-1">
                                              <span>⏱️</span>
                                              <span>{v.durationFormatted || `${v.durationSeconds}s`}</span>
                                            </strong>
                                            <span className="text-[10px] text-zinc-400 block font-medium">{tt.totalStaySub}</span>
                                          </div>
                                        </td>

                                        <td className="py-2.5 px-3">
                                          <div className="max-w-[200px]">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-black truncate border ${
                                              isExternal
                                                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                                                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                            }`}>
                                              <span>{isExternal ? '🔗' : '👑'}</span>
                                              <span className="truncate">{targetDomainName}</span>
                                            </span>
                                            <span className="text-[10px] text-zinc-500 font-mono truncate block mt-0.5">
                                              {targetSub}
                                            </span>
                                          </div>
                                        </td>

                                        <td className="py-2.5 px-3">
                                          <div>
                                            <strong className="text-sm font-mono font-black text-emerald-300 flex items-center gap-1">
                                              <span>⏳</span>
                                              <span>{targetStay}</span>
                                            </strong>
                                            <span className="text-[10px] text-emerald-400/80 block font-medium">{tt.targetDwellSub}</span>
                                          </div>
                                        </td>

                                        <td className="py-2.5 px-3 text-right">
                                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 inline-flex items-center gap-1.5 shadow-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                            <span>{tt.liveBadge}</span>
                                          </span>
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`p-4 rounded-xl border text-center space-y-1.5 ${
                              isDark ? 'bg-[#090a14] border-purple-500/20' : 'bg-white border-slate-200'
                            }`}
                          >
                            <p className="text-xs font-bold text-zinc-300">
                              {tt.activeEmptyTitle}
                            </p>
                            <p className="text-[11px] text-zinc-400">
                              {tt.activeEmptySub}
                            </p>
                          </div>
                        )}

                        {/* Departed Visitors List */}
                        {departedVisitors.length > 0 && (
                          <div className="pt-2 border-t border-purple-500/15">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                              {tt.departedHeader}
                            </span>
                            <div className="overflow-x-auto rounded-xl border border-zinc-800">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className={`border-b text-[10px] uppercase font-black tracking-wider ${
                                    isDark ? 'border-zinc-800 text-zinc-400 bg-white/[0.01]' : 'border-slate-200 text-slate-500 bg-slate-50'
                                  }`}>
                                    <th className="py-2 px-3">{tt.colDepCustomer}</th>
                                    <th className="py-2 px-3">{tt.colDepTotalStay}</th>
                                    <th className="py-2 px-3">{tt.colDepTargetDomain}</th>
                                    <th className="py-2 px-3">{tt.colDepTargetDwell}</th>
                                    <th className="py-2 px-3 text-right">{tt.colDepStatus}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/40">
                                  {departedVisitors.slice(0, 6).map((dep: any, idx: number) => {
                                    const isDepExternal = Boolean(dep.isExternal && dep.targetDomain && dep.targetDomain !== 'no1domain.in' && dep.targetDomain !== 'NO. 1 DOMAIN Directory')
                                    const targetDomainName = isDepExternal ? dep.targetDomain : 'no1domain.in'
                                    const targetStay = dep.targetDurationFormatted || dep.durationFormatted || `${dep.durationSeconds || 1}s`

                                    return (
                                      <tr key={dep.sessionId || idx} className={isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}>
                                        <td className="py-2 px-3">
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-base select-none">{dep.flag || '🇮🇳'}</span>
                                            <div>
                                              <span className={`font-bold text-xs block ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                                                {dep.city || dep.country || 'India'}
                                              </span>
                                              {dep.arrivalTimeFormatted && (
                                                <span className="text-[10px] text-zinc-400 font-mono">
                                                  🕒 {dep.arrivalTimeFormatted}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </td>
                                        <td className="py-2 px-3 font-mono font-bold text-amber-300">
                                          {dep.durationFormatted}
                                        </td>
                                        <td className="py-2 px-3">
                                          <span className={`font-bold truncate block max-w-[150px] ${isDepExternal ? 'text-cyan-300' : 'text-emerald-300'}`}>
                                            {isDepExternal ? '🔗 ' : '👑 '}{targetDomainName}
                                          </span>
                                        </td>
                                        <td className="py-2 px-3 font-mono font-bold text-emerald-300">
                                          {targetStay}
                                        </td>
                                        <td className="py-2 px-3 text-right">
                                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-bold">
                                            {tt.departedBadge}
                                          </span>
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* SECTION 1: Hourly Traffic Trend Chart */}
              {/* SECTION 1: Hourly Traffic Trend Chart */}
              {(dataFastTab === 'all' || dataFastTab === 'chart') && (
                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isDark ? 'bg-[#18191c] border-[#26282e]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#26282e]">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-sky-400" />
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {tt.hourlyChartTitle}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                      <span className="text-xs font-medium text-zinc-400">
                        {dataFastPeriod === 'last24h' ? tt.hourly24hDist : tt.hourlyIntensity}
                      </span>
                    </div>
                  </div>

                  {(() => {
                    const isMonthMode = dataFastPeriod === 'monthToDate' || dataFastPeriod === 'last30d'
                    const points = periodMetrics.chartPoints
                    const maxVal = Math.max(...points, 1)

                    const width = 600
                    const height = 150
                    const padBottom = 20
                    const padTop = 15

                    const coords = points.map((p, idx) => {
                      const x = (idx / (points.length - 1)) * (width - 40) + 20
                      const y = height - padBottom - (p / maxVal) * (height - padBottom - padTop)
                      return { x, y, val: p }
                    })

                    let dPath = `M ${coords[0].x} ${coords[0].y}`
                    for (let i = 0; i < coords.length - 1; i++) {
                      const p0 = coords[i]
                      const p1 = coords[i + 1]
                      const cpX = (p0.x + p1.x) / 2
                      dPath += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`
                    }

                    const areaPath = `${dPath} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`

                    // Active highlighted point based on mouse hover or default showcase point
                    const defaultIdx = periodMetrics.defaultIndex ?? Math.max(0, coords.length - 2)
                    const activeIdx = chartHoverIndex !== null ? chartHoverIndex : defaultIdx
                    const hlPoint = coords[activeIdx] || coords[coords.length - 1]
                    const hlReport = periodMetrics.pointReports?.[activeIdx] || {
                      label: periodMetrics.timeline[activeIdx] || 'Yesterday',
                      visitors: hlPoint.val,
                      views: Math.round(hlPoint.val * 2.1),
                      duration: '1m 45s',
                      badge: activeIdx === defaultIdx ? '🏆 Top Peak' : undefined,
                    }

                    // Smart clamping to ensure tooltip never clips outside the card
                    const clampLeft = Math.min(84, Math.max(16, (hlPoint.x / width) * 100))
                    const clampTop = Math.max(18, (hlPoint.y / height) * 100 - 24)

                    return (
                      <div className="relative pt-2 pb-1">
                        {/* Dynamic Tooltip Box following mouse cursor with detailed report */}
                        <div
                          className="absolute z-20 pointer-events-none p-2.5 sm:p-3 rounded-2xl border shadow-[0_12px_36px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-75 ease-out"
                          style={{
                            top: `${clampTop}%`,
                            left: `${clampLeft}%`,
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: isDark ? 'rgba(24, 26, 38, 0.96)' : 'rgba(15, 23, 42, 0.96)',
                            borderColor: 'rgba(56, 189, 248, 0.45)',
                            minWidth: '155px',
                          }}
                        >
                          <div className="text-[10px] font-bold text-zinc-400 flex items-center justify-between gap-2">
                            <span>{hlReport.label}</span>
                            {hlReport.badge && (
                              <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                                {hlReport.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-3 mt-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-xs bg-sky-400 inline-block shadow-xs"></span>
                              <span className="text-xs font-medium text-zinc-300">Visitors</span>
                            </div>
                            <span className="text-xs font-black font-mono text-white">
                              {hlReport.visitors.toLocaleString()}
                            </span>
                          </div>
                          {/* Live Detailed Report Row */}
                          <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1.5 pt-1.5 border-t border-zinc-700/50">
                            <span>Views: <strong className="text-zinc-200 font-mono">{hlReport.views.toLocaleString()}</strong></span>
                            <span className="font-mono text-yellow-300 font-bold">⏱️ {hlReport.duration}</span>
                          </div>
                        </div>

                        {/* Chart Grid & SVG Area with Mouse Interaction */}
                        <div className="flex items-stretch gap-2 sm:gap-3">
                          {/* Y-Axis Labels */}
                          <div className="flex flex-col justify-between text-[10px] font-mono text-zinc-500 py-2 select-none text-right w-7 flex-shrink-0">
                            <span>{isMonthMode ? '2k' : '100%'}</span>
                            <span>{isMonthMode ? '1k' : '75%'}</span>
                            <span>{isMonthMode ? '900' : '50%'}</span>
                            <span>{isMonthMode ? '450' : '25%'}</span>
                            <span>0</span>
                          </div>

                          {/* SVG Canvas with Interactive Mouse Scrubbing */}
                          <div
                            className="flex-1 relative h-40 sm:h-48 overflow-hidden rounded-xl cursor-crosshair select-none touch-none"
                            onMouseMove={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect()
                              const mouseX = e.clientX - rect.left
                              const frac = Math.max(0, Math.min(1, mouseX / rect.width))
                              const svgX = frac * width
                              let bestIdx = 0
                              let bestDist = Infinity
                              coords.forEach((c, idx) => {
                                const d = Math.abs(c.x - svgX)
                                if (d < bestDist) {
                                  bestDist = d
                                  bestIdx = idx
                                }
                              })
                              setChartHoverIndex(bestIdx)
                            }}
                            onMouseLeave={() => setChartHoverIndex(null)}
                            onTouchMove={(e) => {
                              if (e.touches && e.touches[0]) {
                                const rect = e.currentTarget.getBoundingClientRect()
                                const touchX = e.touches[0].clientX - rect.left
                                const frac = Math.max(0, Math.min(1, touchX / rect.width))
                                const svgX = frac * width
                                let bestIdx = 0
                                let bestDist = Infinity
                                coords.forEach((c, idx) => {
                                  const d = Math.abs(c.x - svgX)
                                  if (d < bestDist) {
                                    bestDist = d
                                    bestIdx = idx
                                  }
                                })
                                setChartHoverIndex(bestIdx)
                              }
                            }}
                            onTouchEnd={() => setChartHoverIndex(null)}
                          >
                            <svg
                              className="w-full h-full"
                              viewBox="0 0 600 160"
                              preserveAspectRatio="none"
                            >
                              <defs>
                                <linearGradient id="dfChartGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                                  <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.12" />
                                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>

                              {/* Horizontal subtle guide lines */}
                              <line x1="0" y1="35" x2="600" y2="35" stroke={isDark ? '#26282e' : '#e2e8f0'} strokeDasharray="3 3" />
                              <line x1="0" y1="75" x2="600" y2="75" stroke={isDark ? '#26282e' : '#e2e8f0'} strokeDasharray="3 3" />
                              <line x1="0" y1="115" x2="600" y2="115" stroke={isDark ? '#26282e' : '#e2e8f0'} strokeDasharray="3 3" />

                              {/* Vertical dotted guide line following active point */}
                              <line
                                x1={hlPoint.x}
                                y1="10"
                                x2={hlPoint.x}
                                y2="150"
                                stroke="#38bdf8"
                                strokeDasharray="3 3"
                                strokeWidth="1.5"
                                opacity="0.8"
                                className="transition-all duration-75"
                              />

                              {/* Gradient Area Fill */}
                              <path d={areaPath} fill="url(#dfChartGradient)" />

                              {/* Smooth Blue Stroke Line */}
                              <path
                                d={dPath}
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="2.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />

                              {/* Dotted drop line to endpoint */}
                              {coords.length > 1 && (
                                <line
                                  x1={coords[coords.length - 1].x}
                                  y1={coords[coords.length - 1].y}
                                  x2={coords[coords.length - 1].x}
                                  y2="150"
                                  stroke="#38bdf8"
                                  strokeDasharray="2 2"
                                  strokeWidth="1.5"
                                  opacity="0.5"
                                />
                              )}

                              {/* Outer halo ring around active highlight point */}
                              <circle
                                cx={hlPoint.x}
                                cy={hlPoint.y}
                                r="7.5"
                                fill="#38bdf8"
                                opacity="0.25"
                                className="transition-all duration-75"
                              />

                              {/* Dot at Highlight Point */}
                              <circle
                                cx={hlPoint.x}
                                cy={hlPoint.y}
                                r="4"
                                fill="#ffffff"
                                stroke="#38bdf8"
                                strokeWidth="2.5"
                                className="transition-all duration-75"
                              />

                              {/* End circle point */}
                              <circle
                                cx={coords[coords.length - 1].x}
                                cy={coords[coords.length - 1].y}
                                r="3.5"
                                fill="#38bdf8"
                              />

                              {/* Transparent overlay rect to guarantee seamless mouse capture */}
                              <rect x="0" y="0" width="600" height="160" fill="transparent" />
                            </svg>
                          </div>
                        </div>

                        {/* X-Axis Timeline Labels & Dynamic Pill */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pl-8 sm:pl-10 pr-2 pt-2 border-t border-[#26282e]">
                          <div className="flex items-center gap-3 sm:gap-8 flex-wrap">
                            {periodMetrics.timeline.map((label, idx) => {
                              const isActive = idx === activeIdx || (chartHoverIndex === null && label.toLowerCase().includes('yesterday'))
                              return (
                                <span
                                  key={idx}
                                  className={`transition-colors cursor-pointer ${
                                    isActive ? 'text-sky-300 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                                  }`}
                                  onClick={() => setChartHoverIndex(idx)}
                                >
                                  {label}
                                </span>
                              )
                            })}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-bold border border-sky-500/40 bg-sky-500/15 text-sky-300 font-mono transition-all">
                              {hlReport.label.toLowerCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* GRID FOR CHANNELS (DONUT CHART) & PAGES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CARD 1: Channels Donut Chart */}
                {/* CARD 1: Acquisition Channels Donut Chart */}
                {(dataFastTab === 'all' || dataFastTab === 'sources') && (() => {
                  const totalVisitsCount = trackingDetails?.totalVisits ?? 7633
                  const totalVisitsFormatted = totalVisitsCount > 999 ? `${(totalVisitsCount / 1000).toFixed(1)}k` : String(totalVisitsCount)

                  // Sub-Sources deep-dive dataset with exact stay duration and behavior metrics
                  const subSourcesData: Record<string, {
                    id: string
                    name: string
                    channelId: string
                    channelName: string
                    icon: string
                    badge: string
                    count: number
                    percent: number
                    avgDuration: string
                    avgSeconds: number
                    totalHours: string
                    pagesPerVisit: string
                    bounceRate: string
                    liveCount: number
                    conversionRate: string
                    distribution: { under30s: number; under2m: number; under5m: number; over5m: number }
                    hindiReport: string
                    englishReport: string
                    color: string
                    strokeColor: string
                  }> = {
                    x_twitter: {
                      id: 'x_twitter',
                      name: '𝕏 Twitter / X',
                      channelId: 'organic_social',
                      channelName: 'Organic Social',
                      icon: '𝕏',
                      badge: '🔥 Viral Social Feed',
                      count: Math.round(totalVisitsCount * 0.181),
                      percent: 18.1,
                      avgDuration: '1m 20s',
                      avgSeconds: 80,
                      totalHours: '440 hrs',
                      pagesPerVisit: '2.4',
                      bounceRate: '38%',
                      liveCount: 14,
                      conversionRate: '4.8%',
                      distribution: { under30s: 18, under2m: 54, under5m: 22, over5m: 6 },
                      hindiReport: '𝕏 (Twitter) se aane wale vyakti website par ausatan 1 minute 20 second (1m 20s) rukte hain aur 2.4 listings browse karte hain. Viral tweets & retweets se active buyers aate hain!',
                      englishReport: 'Visitors from 𝕏 (Twitter) stay on the site for an average of 1m 20s, exploring 2.4 domain listings per session.',
                      color: '#000000',
                      strokeColor: '#818cf8',
                    },
                    youtube: {
                      id: 'youtube',
                      name: '▶️ YouTube',
                      channelId: 'organic_social',
                      channelName: 'Organic Social',
                      icon: '▶️',
                      badge: '🎥 Video Referral Links',
                      count: Math.round(totalVisitsCount * 0.032),
                      percent: 3.2,
                      avgDuration: '2m 00s',
                      avgSeconds: 120,
                      totalHours: '116 hrs',
                      pagesPerVisit: '3.1',
                      bounceRate: '32%',
                      liveCount: 5,
                      conversionRate: '6.2%',
                      distribution: { under30s: 12, under2m: 48, under5m: 32, over5m: 8 },
                      hindiReport: 'YouTube se aane wale vyakti website par ausatan 2 minute 00 second (2m 00s) rukte hain. Video description links se serious buyers aate hain!',
                      englishReport: 'YouTube visitors stay for an average of 2m 00s, browsing 3.1 pages per visit with high engagement.',
                      color: '#ff0000',
                      strokeColor: '#ef4444',
                    },
                    linkedin: {
                      id: 'linkedin',
                      name: '💼 LinkedIn',
                      channelId: 'organic_social',
                      channelName: 'Organic Social',
                      icon: '💼',
                      badge: '👔 B2B Founders & Investors',
                      count: Math.round(totalVisitsCount * 0.027),
                      percent: 2.7,
                      avgDuration: '2m 30s',
                      avgSeconds: 150,
                      totalHours: '122 hrs',
                      pagesPerVisit: '3.6',
                      bounceRate: '28%',
                      liveCount: 6,
                      conversionRate: '7.5%',
                      distribution: { under30s: 10, under2m: 40, under5m: 38, over5m: 12 },
                      hindiReport: 'LinkedIn se aane wale professional investors ausatan 2 minute 30 second (2m 30s) rukte hain. Ye premium domains khareedne me sabse aage rehte hain!',
                      englishReport: 'LinkedIn visitors spend an average of 2m 30s with the highest commercial purchasing intent.',
                      color: '#0a66c2',
                      strokeColor: '#38bdf8',
                    },
                    google: {
                      id: 'google',
                      name: '🔍 Google Search',
                      channelId: 'organic_search',
                      channelName: 'Organic Search',
                      icon: '🔍',
                      badge: '🏆 Sabse Zyada Der Ruka',
                      count: Math.round(totalVisitsCount * 0.15),
                      percent: 15.0,
                      avgDuration: '3m 50s',
                      avgSeconds: 230,
                      totalHours: '1,048 hrs',
                      pagesPerVisit: '4.2',
                      bounceRate: '24%',
                      liveCount: 22,
                      conversionRate: '8.4%',
                      distribution: { under30s: 8, under2m: 32, under5m: 46, over5m: 14 },
                      hindiReport: 'Google Search se aane wale log website par sabse zyada der (3 minute 50 second) rukte hain! Ye direct domain khareedne ya rank dekhne aate hain.',
                      englishReport: 'Google search brings the #1 most engaged visitors who dwell for 3m 50s on average and view 4+ pages.',
                      color: '#4285F4',
                      strokeColor: '#34d399',
                    },
                    duckduckgo: {
                      id: 'duckduckgo',
                      name: '🦆 DuckDuckGo',
                      channelId: 'organic_search',
                      channelName: 'Organic Search',
                      icon: '🦆',
                      badge: '🛡️ Private Search Engine',
                      count: Math.round(totalVisitsCount * 0.019),
                      percent: 1.9,
                      avgDuration: '3m 15s',
                      avgSeconds: 195,
                      totalHours: '114 hrs',
                      pagesPerVisit: '3.8',
                      bounceRate: '26%',
                      liveCount: 3,
                      conversionRate: '7.1%',
                      distribution: { under30s: 9, under2m: 35, under5m: 44, over5m: 12 },
                      hindiReport: 'DuckDuckGo se aane wale privacy-minded vyakti website par 3 minute 15 second rukte hain aur detailed specs check karte hain.',
                      englishReport: 'DuckDuckGo visitors spend an average of 3m 15s exploring domains.',
                      color: '#de5833',
                      strokeColor: '#f97316',
                    },
                    bing: {
                      id: 'bing',
                      name: '🔎 Bing Search',
                      channelId: 'organic_search',
                      channelName: 'Organic Search',
                      icon: '🔎',
                      badge: '💻 Desktop Windows Search',
                      count: Math.round(totalVisitsCount * 0.011),
                      percent: 1.1,
                      avgDuration: '2m 45s',
                      avgSeconds: 165,
                      totalHours: '54 hrs',
                      pagesPerVisit: '3.0',
                      bounceRate: '30%',
                      liveCount: 2,
                      conversionRate: '5.9%',
                      distribution: { under30s: 12, under2m: 42, under5m: 36, over5m: 10 },
                      hindiReport: 'Bing search se aane wale visitors website par 2 minute 45 second rukte hain.',
                      englishReport: 'Bing search visitors average 2m 45s on site.',
                      color: '#008373',
                      strokeColor: '#14b8a6',
                    },
                    direct: {
                      id: 'direct',
                      name: '⚡ Direct URL / Bookmarks',
                      channelId: 'direct',
                      channelName: 'Direct',
                      icon: '⚡',
                      badge: '⭐ Repeat Loyal Customers',
                      count: Math.round(totalVisitsCount * 0.52),
                      percent: 52.0,
                      avgDuration: '1m 45s',
                      avgSeconds: 105,
                      totalHours: '1,656 hrs',
                      pagesPerVisit: '2.8',
                      bounceRate: '34%',
                      liveCount: 48,
                      conversionRate: '5.2%',
                      distribution: { under30s: 14, under2m: 52, under5m: 26, over5m: 8 },
                      hindiReport: 'Direct domain type karne wale ya bookmark wale customers website par 1 minute 45 second rukte hain aur regular visit karte hain.',
                      englishReport: 'Direct visitors average 1m 45s on site with high repeat loyalty.',
                      color: '#36658a',
                      strokeColor: '#38bdf8',
                    },
                    producthunt: {
                      id: 'producthunt',
                      name: '🚀 ProductHunt / Directory',
                      channelId: 'referral',
                      channelName: 'Referral',
                      icon: '🚀',
                      badge: '💡 Startup Community Inbound',
                      count: Math.round(totalVisitsCount * 0.035),
                      percent: 3.5,
                      avgDuration: '2m 20s',
                      avgSeconds: 140,
                      totalHours: '148 hrs',
                      pagesPerVisit: '3.4',
                      bounceRate: '29%',
                      liveCount: 5,
                      conversionRate: '6.8%',
                      distribution: { under30s: 11, under2m: 45, under5m: 34, over5m: 10 },
                      hindiReport: 'ProductHunt aur directories se aane wale vyakti website par 2 minute 20 second rukte hain.',
                      englishReport: 'ProductHunt inbound referrals average 2m 20s on site.',
                      color: '#da552f',
                      strokeColor: '#f59e0b',
                    },
                    tech_blogs: {
                      id: 'tech_blogs',
                      name: '📰 Tech Blogs & Backlinks',
                      channelId: 'referral',
                      channelName: 'Referral',
                      icon: '📰',
                      badge: '🔗 Editorial Mention',
                      count: Math.round(totalVisitsCount * 0.025),
                      percent: 2.5,
                      avgDuration: '2m 05s',
                      avgSeconds: 125,
                      totalHours: '95 hrs',
                      pagesPerVisit: '2.9',
                      bounceRate: '35%',
                      liveCount: 3,
                      conversionRate: '5.0%',
                      distribution: { under30s: 14, under2m: 50, under5m: 28, over5m: 8 },
                      hindiReport: 'Tech news aur articles ke link se aane wale visitors website par 2 minute 05 second rukte hain.',
                      englishReport: 'Blog and news referrals average 2m 05s on site.',
                      color: '#619ec7',
                      strokeColor: '#38bdf8',
                    },
                  }

                  // Rich channels dataset with colors, percentages, stay duration, and sub-sources
                  const channelsMap: Record<string, {
                    id: string
                    name: string
                    count: number
                    percent: number
                    avgDuration: string
                    color: string
                    hoverFill: string
                    strokeColor: string
                    dwellRank: number
                    isHighestStay?: boolean
                    dwellBadge?: string
                    startAngle: number
                    endAngle: number
                    subSources: { name: string; count: string; drillId: string }[]
                    desc: string
                  }> = {
                    direct: {
                      id: 'direct',
                      name: tt.directChannel,
                      count: Math.round(totalVisitsCount * 0.52),
                      percent: 52,
                      avgDuration: '1m 45s',
                      color: '#36658a',
                      hoverFill: '#4c87b5',
                      strokeColor: '#38bdf8',
                      dwellRank: 3,
                      startAngle: 271.5,
                      endAngle: 126,
                      subSources: [
                        { name: 'Bookmarks', count: '38.6k', drillId: 'direct' },
                        { name: 'Direct URL typed', count: '18.2k', drillId: 'direct' },
                      ],
                      desc: 'Users who typed domain directly or used bookmarks (Loyal traffic)',
                    },
                    organic_social: {
                      id: 'organic_social',
                      name: tt.organicSocialChannel,
                      count: Math.round(totalVisitsCount * 0.24),
                      percent: 24,
                      avgDuration: '1m 15s',
                      color: '#41779f',
                      hoverFill: '#5797c7',
                      strokeColor: '#818cf8',
                      dwellRank: 4,
                      startAngle: 128,
                      endAngle: 196,
                      subSources: [
                        { name: '𝕏 Twitter / X', count: '19.8k', drillId: 'x_twitter' },
                        { name: '💼 LinkedIn', count: '3.8k', drillId: 'linkedin' },
                        { name: '▶️ YouTube', count: '2.6k', drillId: 'youtube' },
                      ],
                      desc: 'Viral community posts and social media shares',
                    },
                    organic_search: {
                      id: 'organic_search',
                      name: tt.organicSearchChannel,
                      count: Math.round(totalVisitsCount * 0.18),
                      percent: 18,
                      avgDuration: '3m 48s',
                      color: '#4f8ab4',
                      hoverFill: '#64aadb',
                      strokeColor: '#34d399',
                      dwellRank: 1,
                      isHighestStay: true,
                      dwellBadge: '🏆 Sabse Zyada Der Ruka',
                      startAngle: 198,
                      endAngle: 244,
                      subSources: [
                        { name: '🔍 Google', count: '16.4k', drillId: 'google' },
                        { name: '🦆 DuckDuckGo', count: '2.1k', drillId: 'duckduckgo' },
                        { name: '🔎 Bing', count: '1.1k', drillId: 'bing' },
                      ],
                      desc: 'High-intent search engine queries (Highest retention & interest!)',
                    },
                    referral: {
                      id: 'referral',
                      name: tt.referralChannel,
                      count: Math.round(totalVisitsCount * 0.06),
                      percent: 6,
                      avgDuration: '2m 10s',
                      color: '#619ec7',
                      hoverFill: '#79c0eb',
                      strokeColor: '#f59e0b',
                      dwellRank: 2,
                      startAngle: 246,
                      endAngle: 258,
                      subSources: [
                        { name: '🚀 ProductHunt', count: '3.8k', drillId: 'producthunt' },
                        { name: '📰 Tech Blogs', count: '1.8k', drillId: 'tech_blogs' },
                        { name: '💬 Forums', count: '958', drillId: 'tech_blogs' },
                      ],
                      desc: 'External website links, directory listings, and news mentions',
                    },
                  }

                  const activeHudId = hoveredDonutChannel || clickedDonutChannel || (selectedChannelId && channelsMap[selectedChannelId] ? selectedChannelId : null)
                  const activeHudChan = activeHudId ? channelsMap[activeHudId] : null
                  const clickedChan = clickedDonutChannel && channelsMap[clickedDonutChannel] ? channelsMap[clickedDonutChannel] : null
                  const activeSubSource = selectedDrilldownSourceId && subSourcesData[selectedDrilldownSourceId]
                    ? subSourcesData[selectedDrilldownSourceId]
                    : null

                  return (
                    <div
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isDark ? 'bg-[#18191c] border-[#26282e]' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div>
                        {/* Card Header: Tabs & All Dropdown */}
                        <div className="flex items-center justify-between mb-2 pb-1 relative">
                          <div
                            className={`p-0.5 rounded-xl flex items-center gap-1 ${
                              isDark ? 'bg-transparent' : 'bg-slate-100'
                            }`}
                          >
                            {(['channel', 'referrer', 'campaign'] as const).map((tab) => (
                              <button
                                key={tab}
                                type="button"
                                onClick={() => setChannelPillTab(tab)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                  channelPillTab === tab
                                    ? isDark ? 'bg-[#26282e] text-white shadow-xs font-semibold' : 'bg-white text-slate-900 shadow-xs font-semibold'
                                    : isDark ? 'text-[#828795] hover:text-white' : 'text-slate-500 hover:text-slate-900'
                                }`}
                              >
                                {tab === 'channel' ? tt.pillChannel : tab === 'referrer' ? tt.pillReferrer : tt.pillCampaign}
                              </button>
                            ))}
                          </div>

                          {/* All / Filter Dropdown */}
                          <div className="relative" ref={channelDropdownRef}>
                            <button
                              type="button"
                              onClick={() => setIsAllChannelsDropdownOpen(!isAllChannelsDropdownOpen)}
                              className="flex items-center gap-1.5 text-xs font-medium text-[#828795] hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer select-none"
                            >
                              <span>
                                {selectedChannelId && channelsMap[selectedChannelId]
                                  ? `${channelsMap[selectedChannelId].name} (${(channelsMap[selectedChannelId].count / 1000).toFixed(1)}k)`
                                  : `${tt.allLabel} (${totalVisitsFormatted})`}
                              </span>
                              <span className={`text-[10px] leading-none transition-transform duration-200 ${isAllChannelsDropdownOpen ? 'rotate-180' : ''}`}>&#x2304;</span>
                            </button>

                            {/* Dropdown Menu */}
                            {isAllChannelsDropdownOpen && (
                              <div
                                className={`absolute right-0 top-full mt-1.5 z-40 w-56 p-1.5 rounded-xl border shadow-2xl backdrop-blur-md animate-fadeIn ${
                                  isDark ? 'bg-[#18191c]/95 border-[#26282e]' : 'bg-white/95 border-slate-200'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedChannelId(null)
                                    setClickedDonutChannel(null)
                                    setHoveredDonutChannel(null)
                                    setIsAllChannelsDropdownOpen(false)
                                  }}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                                    selectedChannelId === null
                                      ? 'bg-sky-500/20 text-sky-300 font-bold'
                                      : isDark ? 'text-zinc-300 hover:bg-white/5 hover:text-white' : 'text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  <span>{tt.allLabel} Channels</span>
                                  <span className="font-mono text-[11px] text-zinc-400">{totalVisitsFormatted} (100%)</span>
                                </button>

                                {Object.values(channelsMap).map((chan) => (
                                  <button
                                    key={chan.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedChannelId(chan.id)
                                      setClickedDonutChannel(chan.id)
                                      setHoveredDonutChannel(null)
                                      setIsAllChannelsDropdownOpen(false)
                                    }}
                                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                                      selectedChannelId === chan.id
                                        ? 'bg-sky-500/20 text-sky-300 font-bold'
                                        : isDark ? 'text-zinc-300 hover:bg-white/5 hover:text-white' : 'text-slate-700 hover:bg-slate-100'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chan.strokeColor }} />
                                      <span>{chan.name}</span>
                                    </div>
                                    <span className="font-mono text-[11px] text-zinc-400">
                                      {(chan.count / 1000).toFixed(1)}k ({chan.percent}%)
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Donut Chart View (Tab: Channel) */}
                        {channelPillTab === 'channel' && (() => {
                          const cx = 250
                          const cy = 185
                          const baseRIn = 72
                          const baseROut = 126

                          // Fallback coordinates for popup cards anchored around respective slices
                          const fallbackCoords: Record<string, { x: number; y: number }> = {
                            direct: { x: 74, y: 55 },
                            organic_social: { x: 26, y: 72 },
                            organic_search: { x: 25, y: 25 },
                            referral: { x: 48, y: 15 },
                            micros: { x: 50, y: 15 },
                          }

                          return (
                            <div
                              className="relative py-2 flex items-center justify-center select-none"
                              onMouseLeave={() => {
                                setHoveredDonutChannel(null)
                              }}
                              onTouchEnd={() => {
                                setHoveredDonutChannel(null)
                              }}
                            >
                              {/* Floating Details Box - ONLY shown when user CLICKS a slice/channel */}
                              {clickedChan && (
                                <div
                                  className={`absolute z-30 p-3.5 rounded-2xl border backdrop-blur-md transition-all duration-150 ease-out animate-fadeIn cursor-default ${
                                    isDark
                                      ? 'shadow-[0_20px_50px_rgba(0,0,0,0.92)] bg-[#141620]/95 text-white'
                                      : 'shadow-[0_20px_50px_rgba(15,23,42,0.18)] bg-white text-slate-900'
                                  }`}
                                  style={{
                                    top: `${fallbackCoords[clickedChan.id]?.y ?? 35}%`,
                                    left: `${fallbackCoords[clickedChan.id]?.x ?? 35}%`,
                                    transform: 'translate(-50%, -50%)',
                                    borderColor: clickedChan.strokeColor,
                                    minWidth: '220px',
                                  }}
                                >
                                  {/* Tooltip Header with Close Button */}
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        className="w-2.5 h-2.5 rounded-full inline-block shadow-xs"
                                        style={{ backgroundColor: clickedChan.strokeColor }}
                                      />
                                      <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {clickedChan.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        className="text-[10px] font-black px-1.5 py-0.5 rounded-full font-mono border"
                                        style={{
                                          backgroundColor: `${clickedChan.strokeColor}22`,
                                          borderColor: `${clickedChan.strokeColor}55`,
                                          color: clickedChan.strokeColor,
                                        }}
                                      >
                                        {clickedChan.percent}%
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setClickedDonutChannel(null)
                                        }}
                                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-colors cursor-pointer ${
                                          isDark
                                            ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                                            : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                        title="Close"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  </div>

                                  {/* Metric Row: Visitors */}
                                  <div className="flex items-center justify-between gap-3 mt-2 text-xs">
                                    <span className={isDark ? 'text-zinc-400' : 'text-slate-500 font-medium'}>Visitors:</span>
                                    <span className={`font-mono font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                      {clickedChan.count.toLocaleString()}
                                    </span>
                                  </div>

                                  {/* Metric Row: Stay Duration (Kitni der ruka hai vyakti) */}
                                  <div className="flex items-center justify-between gap-3 mt-1 text-xs">
                                    <span className={`${isDark ? 'text-zinc-400' : 'text-slate-600'} font-semibold`}>⏱️ Avg Stay Time:</span>
                                    <span className={`font-mono font-bold ${isDark ? 'text-yellow-300' : 'text-amber-600'}`}>
                                      {clickedChan.avgDuration}
                                    </span>
                                  </div>

                                  {/* Longest Stay Badge */}
                                  {clickedChan.isHighestStay && (
                                    <div className={`mt-1.5 pt-1.5 border-t flex items-center justify-center ${isDark ? 'border-zinc-700/50' : 'border-slate-200'}`}>
                                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                        isDark
                                          ? 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40'
                                          : 'text-emerald-800 bg-emerald-50 border-emerald-300'
                                      }`}>
                                        🏆 Sabse Zyada Der Ruka
                                      </span>
                                    </div>
                                  )}

                                  {/* Top Sub-Sources Breakdown: Clickable Pills to inspect source stay time */}
                                  {clickedChan.subSources && clickedChan.subSources.length > 0 && (
                                    <div className={`mt-2 pt-1.5 border-t space-y-1 ${isDark ? 'border-zinc-700/50' : 'border-slate-200'}`}>
                                      <div className={`text-[9px] uppercase tracking-wider font-semibold flex items-center justify-between ${
                                        isDark ? 'text-zinc-400' : 'text-slate-500'
                                      }`}>
                                        <span>Click to Inspect:</span>
                                        <span className={isDark ? 'text-cyan-400' : 'text-sky-600'}>👆 Tap any</span>
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {clickedChan.subSources.map((sub, i) => (
                                          <button
                                            key={i}
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setSelectedDrilldownSourceId(sub.drillId)
                                              setSelectedChannelId(clickedChan.id)
                                            }}
                                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono cursor-pointer transition-colors border flex items-center gap-1 ${
                                              isDark
                                                ? 'bg-zinc-800 hover:bg-sky-500/30 text-zinc-300 hover:text-white border-transparent hover:border-sky-400'
                                                : 'bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-900 border-slate-200 hover:border-sky-300'
                                            }`}
                                          >
                                            <span>{sub.name}</span>
                                            <strong className={isDark ? 'text-white' : 'text-slate-900'}>({sub.count})</strong>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Donut SVG Canvas with Interactive Slice Pop-Out */}
                              <svg
                                viewBox="0 0 500 370"
                                className="w-full max-w-[460px] h-auto select-none overflow-visible cursor-pointer"
                              >
                                <defs>
                                  <filter id="donutGlow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#38bdf8" floodOpacity="0.65" />
                                  </filter>
                                </defs>

                                {/* Donut Slices */}
                                {Object.values(channelsMap).map((chan) => {
                                  const isHovered = hoveredDonutChannel === chan.id
                                  const isClicked = clickedDonutChannel === chan.id
                                  const isAnyHovered = hoveredDonutChannel !== null
                                  const isDimmed = isAnyHovered ? !isHovered : (clickedDonutChannel !== null && !isClicked)
                                  const isHighlighted = isHovered || isClicked
                                  const rIn = isHighlighted ? baseRIn - 3 : baseRIn
                                  const rOut = isHighlighted ? baseROut + 11 : baseROut

                                  return (
                                    <path
                                      key={chan.id}
                                      d={getArcSectorPath(cx, cy, rIn, rOut, chan.startAngle, chan.endAngle)}
                                      fill={isHighlighted ? chan.hoverFill : chan.color}
                                      stroke={isHighlighted ? chan.strokeColor : 'none'}
                                      strokeWidth={isHighlighted ? 2.5 : 0}
                                      strokeLinejoin="round"
                                      opacity={isDimmed ? 0.38 : 1}
                                      filter={isHighlighted ? 'url(#donutGlow)' : undefined}
                                      className="transition-all duration-200 cursor-pointer"
                                      onMouseEnter={() => setHoveredDonutChannel(chan.id)}
                                      onMouseLeave={() => setHoveredDonutChannel(null)}
                                      onClick={() => {
                                        const nextId = clickedDonutChannel === chan.id ? null : chan.id
                                        setClickedDonutChannel(nextId)
                                        setSelectedChannelId(nextId)
                                        if (nextId) {
                                          const defaultDrill = chan.id === 'organic_social' ? 'x_twitter'
                                            : chan.id === 'organic_search' ? 'google'
                                            : chan.id === 'referral' ? 'producthunt'
                                            : 'direct'
                                          setSelectedDrilldownSourceId(defaultDrill)
                                        }
                                      }}
                                    />
                                  )
                                })}

                                {/* Micro Slivers */}
                                {(() => {
                                  const isMicroHovered = hoveredDonutChannel === 'referral'
                                  const isMicroClicked = clickedDonutChannel === 'referral'
                                  const isAnyHovered = hoveredDonutChannel !== null
                                  const isDimmed = isAnyHovered ? !isMicroHovered : (clickedDonutChannel !== null && !isMicroClicked)
                                  const isMicroHighlighted = isMicroHovered || isMicroClicked
                                  const rIn = isMicroHighlighted ? baseRIn - 2 : baseRIn
                                  const rOut = isMicroHighlighted ? baseROut + 8 : baseROut
                                  const microColors = ['#6da7cf', '#78b1d8', '#82bae0', '#8cc3e7', '#96ccef']
                                  const microAngles = [
                                    [259.5, 261.2],
                                    [261.8, 263.5],
                                    [264.1, 265.8],
                                    [266.4, 268.1],
                                    [268.7, 270.4],
                                  ]

                                  return (
                                    <g
                                      className="cursor-pointer transition-all duration-200"
                                      opacity={isDimmed ? 0.38 : 1}
                                      onMouseEnter={() => setHoveredDonutChannel('referral')}
                                      onMouseLeave={() => setHoveredDonutChannel(null)}
                                      onClick={() => {
                                        const nextId = clickedDonutChannel === 'referral' ? null : 'referral'
                                        setClickedDonutChannel(nextId)
                                        setSelectedChannelId(nextId)
                                        if (nextId) setSelectedDrilldownSourceId('producthunt')
                                      }}
                                    >
                                      {microAngles.map(([s, e], idx) => (
                                        <path
                                          key={idx}
                                          d={getArcSectorPath(cx, cy, rIn, rOut, s, e)}
                                          fill={microColors[idx]}
                                          className="transition-all duration-200"
                                        />
                                      ))}
                                    </g>
                                  )
                                })()}

                                {/* Center Donut Hole HUD: Interactive Report */}
                                <g
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setHoveredDonutChannel(null)
                                    setClickedDonutChannel(null)
                                    setSelectedChannelId(null)
                                  }}
                                >
                                  <circle
                                    cx={cx}
                                    cy={cy}
                                    r={baseRIn - 2}
                                    fill={isDark ? '#14151a' : '#ffffff'}
                                    stroke={activeHudChan ? activeHudChan.strokeColor : isDark ? '#26282e' : '#e2e8f0'}
                                    strokeWidth={activeHudChan ? '2' : '1.5'}
                                    className="transition-all duration-200"
                                  />

                                  {activeHudChan ? (
                                    <>
                                      <text
                                        x={cx}
                                        y={cy - 20}
                                        textAnchor="middle"
                                        fill={activeHudChan.strokeColor}
                                        fontSize="11"
                                        fontWeight="800"
                                        letterSpacing="1"
                                        className="transition-all duration-150"
                                      >
                                        {activeHudChan.name.toUpperCase()}
                                      </text>
                                      <text
                                        x={cx}
                                        y={cy + 8}
                                        textAnchor="middle"
                                        fill={isDark ? '#ffffff' : '#0f172a'}
                                        fontSize="27"
                                        fontWeight="900"
                                        fontFamily="system-ui"
                                        className="transition-all duration-150"
                                      >
                                        {activeHudChan.percent}%
                                      </text>
                                      <text
                                        x={cx}
                                        y={cy + 25}
                                        textAnchor="middle"
                                        fill={isDark ? '#cbd5e1' : '#475569'}
                                        fontSize="11"
                                        fontWeight="600"
                                        fontFamily="monospace"
                                      >
                                        {activeHudChan.count.toLocaleString()} visits
                                      </text>
                                      <text
                                        x={cx}
                                        y={cy + 40}
                                        textAnchor="middle"
                                        fill={isDark ? '#facc15' : '#b45309'}
                                        fontSize="10"
                                        fontWeight="700"
                                        fontFamily="monospace"
                                      >
                                        ⏱️ {activeHudChan.avgDuration}
                                      </text>
                                    </>
                                  ) : (
                                    <>
                                      <text
                                        x={cx}
                                        y={cy - 14}
                                        textAnchor="middle"
                                        fill={isDark ? '#828795' : '#64748b'}
                                        fontSize="10"
                                        fontWeight="700"
                                        letterSpacing="1"
                                      >
                                        TOTAL VISITS
                                      </text>
                                      <text
                                        x={cx}
                                        y={cy + 13}
                                        textAnchor="middle"
                                        fill={isDark ? '#ffffff' : '#0f172a'}
                                        fontSize="25"
                                        fontWeight="900"
                                        fontFamily="system-ui"
                                      >
                                        {totalVisitsFormatted}
                                      </text>
                                      <text
                                        x={cx}
                                        y={cy + 30}
                                        textAnchor="middle"
                                        fill={isDark ? '#38bdf8' : '#0284c7'}
                                        fontSize="10"
                                        fontWeight="600"
                                      >
                                        Click to inspect 👆
                                      </text>
                                    </>
                                  )}
                                </g>

                                {/* In-Arc Brand Badges: Organic Social (Clickable directly for X, YouTube, LinkedIn) */}
                                <g
                                  className="cursor-pointer"
                                  onMouseEnter={() => setHoveredDonutChannel('organic_social')}
                                  onMouseLeave={() => setHoveredDonutChannel(null)}
                                >
                                  {/* X (Twitter) Icon - Direct Click for X details */}
                                  <g
                                    transform="translate(144, 218)"
                                    className="cursor-pointer hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setClickedDonutChannel('organic_social')
                                      setSelectedChannelId('organic_social')
                                      setSelectedDrilldownSourceId('x_twitter')
                                    }}
                                  >
                                    <title>Click to see 𝕏 Twitter stay duration & report</title>
                                    <rect x="0" y="0" width="16" height="16" rx="3.5" fill="#000000" />
                                    <path
                                      d="M4 4.5 L7.5 9.2 L4.2 13 H5.3 L8.1 9.9 L10.6 13 H13.2 L9.3 8.1 L12.5 4.5 H11.4 L8.8 7.4 L6.5 4.5 Z"
                                      fill="#ffffff"
                                    />
                                  </g>
                                  {/* YouTube Icon - Direct Click for YouTube details */}
                                  <g
                                    transform="translate(164, 219)"
                                    className="cursor-pointer hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setClickedDonutChannel('organic_social')
                                      setSelectedChannelId('organic_social')
                                      setSelectedDrilldownSourceId('youtube')
                                    }}
                                  >
                                    <title>Click to see YouTube stay duration & report</title>
                                    <rect x="0" y="0" width="16" height="13" rx="3.5" fill="#ff0000" />
                                    <polygon points="6,3.5 11.5,6.5 6,9.5" fill="#ffffff" />
                                  </g>
                                  {/* LinkedIn Icon - Direct Click for LinkedIn details */}
                                  <g
                                    transform="translate(153, 237)"
                                    className="cursor-pointer hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setClickedDonutChannel('organic_social')
                                      setSelectedChannelId('organic_social')
                                      setSelectedDrilldownSourceId('linkedin')
                                    }}
                                  >
                                    <title>Click to see LinkedIn stay duration & report</title>
                                    <rect x="0" y="0" width="16" height="16" rx="3.5" fill="#0a66c2" />
                                    <text
                                      x="8"
                                      y="12"
                                      textAnchor="middle"
                                      fill="#ffffff"
                                      fontSize="10"
                                      fontWeight="bold"
                                      fontFamily="system-ui"
                                    >
                                      in
                                    </text>
                                  </g>
                                </g>

                                {/* In-Arc Brand Badges: Organic Search (Clickable directly for Google, Bing, DuckDuckGo) */}
                                <g
                                  className="cursor-pointer"
                                  onMouseEnter={() => setHoveredDonutChannel('organic_search')}
                                  onMouseLeave={() => setHoveredDonutChannel(null)}
                                >
                                  {/* Google G - Direct Click for Google details */}
                                  <g
                                    transform="translate(155, 136)"
                                    className="cursor-pointer hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setClickedDonutChannel('organic_search')
                                      setSelectedChannelId('organic_search')
                                      setSelectedDrilldownSourceId('google')
                                    }}
                                  >
                                    <title>Click to see Google search stay duration & report</title>
                                    <circle cx="8" cy="8" r="8" fill="#ffffff" />
                                    <path
                                      d="M11.8 8.1c0-.3-.03-.6-.08-.9H8v1.7h2.1c-.1.5-.4 1-.8 1.3v1.1h1.3c.8-.7 1.2-1.8 1.2-3.2z"
                                      fill="#4285F4"
                                    />
                                    <path
                                      d="M8 12c1.1 0 2-.4 2.7-1l-1.3-1.1c-.4.3-.9.4-1.4.4-1.1 0-2-.7-2.3-1.7H4.3v1.1C5 11.2 6.4 12 8 12z"
                                      fill="#34A853"
                                    />
                                    <path
                                      d="M5.7 8.6c-.1-.3-.1-.6-.1-.9 0-.3 0-.6.1-.9V5.7H4.3C3.8 6.6 3.6 7.4 3.6 8.3s.2 1.7.7 2.6l1.4-1.1z"
                                      fill="#FBBC05"
                                    />
                                    <path
                                      d="M8 4.6c.6 0 1.1.2 1.5.6l1.2-1.2C10 3.3 9.1 2.8 8 2.8 6.4 2.8 5 3.6 4.3 4.8l1.4 1.1c.3-1 1.2-1.7 2.3-1.7z"
                                      fill="#EA4335"
                                    />
                                  </g>
                                  {/* DuckDuckGo Orange - Direct Click */}
                                  <g
                                    transform="translate(167, 116)"
                                    className="cursor-pointer hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setClickedDonutChannel('organic_search')
                                      setSelectedChannelId('organic_search')
                                      setSelectedDrilldownSourceId('duckduckgo')
                                    }}
                                  >
                                    <title>Click to see DuckDuckGo stay duration & report</title>
                                    <circle cx="8" cy="8" r="8" fill="#de5833" />
                                    <circle cx="7.5" cy="7" r="2.8" fill="#ffffff" />
                                    <polygon points="9.5,6.5 12.5,7.5 9.5,8.5" fill="#f89c1e" />
                                  </g>
                                  {/* Blue Search / Bing - Direct Click */}
                                  <g
                                    transform="translate(181, 99)"
                                    className="cursor-pointer hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setClickedDonutChannel('organic_search')
                                      setSelectedChannelId('organic_search')
                                      setSelectedDrilldownSourceId('bing')
                                    }}
                                  >
                                    <title>Click to see Bing search stay duration & report</title>
                                    <circle cx="8" cy="8" r="8" fill="#1d9bf0" />
                                    <circle cx="7" cy="7" r="3" fill="none" stroke="#fff" strokeWidth="1.2" />
                                    <line x1="9.2" y1="9.2" x2="12" y2="12" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
                                  </g>
                                </g>

                                {/* Pointer Lines & Interactive Labels */}
                                {/* Direct */}
                                {(() => {
                                  const isDirectActive = hoveredDonutChannel === 'direct' || (hoveredDonutChannel === null && clickedDonutChannel === 'direct')
                                  return (
                                    <g
                                      className="cursor-pointer transition-all duration-200"
                                      onMouseEnter={() => setHoveredDonutChannel('direct')}
                                      onMouseLeave={() => setHoveredDonutChannel(null)}
                                      onClick={() => {
                                        const nextId = clickedDonutChannel === 'direct' ? null : 'direct'
                                        setClickedDonutChannel(nextId)
                                        setSelectedChannelId(nextId)
                                        if (nextId) setSelectedDrilldownSourceId('direct')
                                      }}
                                    >
                                      <polyline
                                        points="364,242 384,258 406,258"
                                        fill="none"
                                        stroke={isDirectActive ? '#0284c7' : (isDark ? '#4f7e9f' : '#94a3b8')}
                                        strokeWidth={isDirectActive ? '2.5' : '1.5'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <text
                                        x="414"
                                        y="262"
                                        fill={isDirectActive ? (isDark ? '#ffffff' : '#0f172a') : (isDark ? '#d1d5db' : '#475569')}
                                        fontSize="13"
                                        fontWeight={isDirectActive ? '700' : '500'}
                                        textAnchor="start"
                                        className="select-none transition-colors"
                                      >
                                        Direct
                                      </text>
                                    </g>
                                  )
                                })()}

                                {/* Organic social */}
                                {(() => {
                                  const isSocialActive = hoveredDonutChannel === 'organic_social' || (hoveredDonutChannel === null && clickedDonutChannel === 'organic_social')
                                  return (
                                    <g
                                      className="cursor-pointer transition-all duration-200"
                                      onMouseEnter={() => setHoveredDonutChannel('organic_social')}
                                      onMouseLeave={() => setHoveredDonutChannel(null)}
                                      onClick={() => {
                                        const nextId = clickedDonutChannel === 'organic_social' ? null : 'organic_social'
                                        setClickedDonutChannel(nextId)
                                        setSelectedChannelId(nextId)
                                        if (nextId) setSelectedDrilldownSourceId('x_twitter')
                                      }}
                                    >
                                      <line
                                        x1="124"
                                        y1="218"
                                        x2="94"
                                        y2="218"
                                        stroke={isSocialActive ? '#6366f1' : (isDark ? '#4f7e9f' : '#94a3b8')}
                                        strokeWidth={isSocialActive ? '2.5' : '1.5'}
                                        strokeLinecap="round"
                                      />
                                      <text
                                        x="86"
                                        y="222"
                                        fill={isSocialActive ? (isDark ? '#ffffff' : '#0f172a') : (isDark ? '#d1d5db' : '#475569')}
                                        fontSize="13"
                                        fontWeight={isSocialActive ? '700' : '500'}
                                        textAnchor="end"
                                        className="select-none transition-colors"
                                      >
                                        Organic social
                                      </text>
                                    </g>
                                  )
                                })()}

                                {/* Organic search */}
                                {(() => {
                                  const isSearchActive = hoveredDonutChannel === 'organic_search' || (hoveredDonutChannel === null && clickedDonutChannel === 'organic_search')
                                  return (
                                    <g
                                      className="cursor-pointer transition-all duration-200"
                                      onMouseEnter={() => setHoveredDonutChannel('organic_search')}
                                      onMouseLeave={() => setHoveredDonutChannel(null)}
                                      onClick={() => {
                                        const nextId = clickedDonutChannel === 'organic_search' ? null : 'organic_search'
                                        setClickedDonutChannel(nextId)
                                        setSelectedChannelId(nextId)
                                        if (nextId) setSelectedDrilldownSourceId('google')
                                      }}
                                    >
                                      <polyline
                                        points="156,114 138,96 112,96"
                                        fill="none"
                                        stroke={isSearchActive ? '#059669' : (isDark ? '#4f7e9f' : '#94a3b8')}
                                        strokeWidth={isSearchActive ? '2.5' : '1.5'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <text
                                        x="104"
                                        y="100"
                                        fill={isSearchActive ? (isDark ? '#ffffff' : '#0f172a') : (isDark ? '#d1d5db' : '#475569')}
                                        fontSize="13"
                                        fontWeight={isSearchActive ? '700' : '500'}
                                        textAnchor="end"
                                        className="select-none transition-colors"
                                      >
                                        Organic search
                                      </text>
                                    </g>
                                  )
                                })()}

                                {/* Referral */}
                                {(() => {
                                  const isReferralActive = hoveredDonutChannel === 'referral' || (hoveredDonutChannel === null && clickedDonutChannel === 'referral')
                                  return (
                                    <g
                                      className="cursor-pointer transition-all duration-200"
                                      onMouseEnter={() => setHoveredDonutChannel('referral')}
                                      onMouseLeave={() => setHoveredDonutChannel(null)}
                                      onClick={() => {
                                        const nextId = clickedDonutChannel === 'referral' ? null : 'referral'
                                        setClickedDonutChannel(nextId)
                                        setSelectedChannelId(nextId)
                                        if (nextId) setSelectedDrilldownSourceId('producthunt')
                                      }}
                                    >
                                      <polyline
                                        points="212,74 212,52 192,52"
                                        fill="none"
                                        stroke={isReferralActive ? '#d97706' : (isDark ? '#4f7e9f' : '#94a3b8')}
                                        strokeWidth={isReferralActive ? '2.5' : '1.5'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <text
                                        x="184"
                                        y="56"
                                        fill={isReferralActive ? (isDark ? '#ffffff' : '#0f172a') : (isDark ? '#d1d5db' : '#475569')}
                                        fontSize="13"
                                        fontWeight={isReferralActive ? '700' : '500'}
                                        textAnchor="end"
                                        className="select-none transition-colors"
                                      >
                                        Referral
                                      </text>
                                    </g>
                                  )
                                })()}
                              </svg>
                            </div>
                          )
                        })()}

                        {/* Referrer Tab */}
                        {channelPillTab === 'referrer' && (() => {
                          const referrers: any[] = trackingDetails?.referrers || []
                          return (
                            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                              {referrers.map((ref, idx) => {
                                const mapToDrillId = ref.source.toLowerCase().includes('twitter') ? 'x_twitter'
                                  : ref.source.toLowerCase().includes('youtube') ? 'youtube'
                                  : ref.source.toLowerCase().includes('linkedin') ? 'linkedin'
                                  : ref.source.toLowerCase().includes('google') ? 'google'
                                  : ref.source.toLowerCase().includes('reddit') ? 'x_twitter'
                                  : ref.source.toLowerCase().includes('direct') ? 'direct'
                                  : 'producthunt'
                                return (
                                  <div
                                    key={idx}
                                    onClick={() => setSelectedDrilldownSourceId(mapToDrillId)}
                                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all hover:bg-white/5 ${
                                      ref.isHighestStay
                                        ? isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
                                        : isDark ? 'bg-[#18191c] border-[#26282e]' : 'bg-slate-50 border-slate-200'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-sm">{ref.icon}</span>
                                      <span className="font-bold truncate text-xs">{ref.source}</span>
                                      {ref.isHighestStay && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                          {tt.longestStayBadge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="font-mono font-black text-yellow-300 text-xs">
                                        ⏱️ {ref.avgDuration}
                                      </span>
                                      <span className="font-mono text-xs text-white">
                                        {ref.count.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )
                        })()}

                        {/* Campaign Tab */}
                        {channelPillTab === 'campaign' && (() => {
                          const campaigns: any[] = trackingDetails?.campaigns || []
                          return (
                            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                              {campaigns.map((cmp, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => setSelectedDrilldownSourceId('google')}
                                  className="p-2.5 rounded-xl border flex items-center justify-between text-xs border-[#26282e] hover:bg-white/5 transition-all cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-sm">🎯</span>
                                    <span className="font-bold truncate text-xs font-mono">{cmp.campaign}</span>
                                    {cmp.isHighestStay && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                        {tt.longestStayBadge}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-mono font-black text-yellow-300 text-xs">
                                      ⏱️ {cmp.avgDuration}
                                    </span>
                                    <span className="font-mono text-xs text-white">
                                      {cmp.count.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        })()}
                      </div>

                      {/* Interactive Deep-Dive Source Inspector (Kitni der ruka hai vyakti) */}
                      {activeSubSource && (
                        <div className={`mt-4 p-4 rounded-2xl border transition-all animate-fadeIn ${
                          isDark
                            ? 'border-sky-500/50 bg-gradient-to-br from-[#12141a] to-[#1a1c24] shadow-[0_16px_40px_rgba(0,0,0,0.7)]'
                            : 'border-sky-200 bg-white shadow-xl shadow-slate-200/60'
                        }`}>
                          {/* Inspector Header */}
                          <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-[#26282e]' : 'border-slate-200'}`}>
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-base font-bold shadow-md"
                                style={{
                                  backgroundColor: activeSubSource.color || '#000',
                                  border: `1.5px solid ${activeSubSource.strokeColor}`,
                                }}
                              >
                                {activeSubSource.icon}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className={`text-sm font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeSubSource.name}</h4>
                                  <span
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                                    style={{
                                      backgroundColor: `${activeSubSource.strokeColor}22`,
                                      borderColor: `${activeSubSource.strokeColor}55`,
                                      color: activeSubSource.strokeColor,
                                    }}
                                  >
                                    {activeSubSource.badge}
                                  </span>
                                </div>
                                <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                                  Channel: <strong className={isDark ? 'text-zinc-200' : 'text-slate-900'}>{activeSubSource.channelName}</strong> • {activeSubSource.count.toLocaleString()} visitors ({activeSubSource.percent}%)
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedDrilldownSourceId(null)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer text-xs font-bold ${
                                isDark ? 'text-zinc-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                              }`}
                              title="Close Inspector"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Quick Source Switcher Bar (User can click any other source directly!) */}
                          <div className={`flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar border-b ${isDark ? 'border-[#26282e]' : 'border-slate-200'}`}>
                            <span className={`text-[10px] uppercase font-bold flex-shrink-0 mr-1 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Switch:</span>
                            {Object.values(subSourcesData).map((src) => {
                              const isCurrent = activeSubSource.id === src.id
                              return (
                                <button
                                  key={src.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDrilldownSourceId(src.id)
                                    setSelectedChannelId(src.channelId)
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 flex-shrink-0 transition-all cursor-pointer ${
                                    isCurrent
                                      ? (isDark ? 'bg-sky-500/25 text-white font-bold border border-sky-400 shadow-sm' : 'bg-sky-600 text-white font-bold border border-sky-600 shadow-sm')
                                      : (isDark ? 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent' : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200')
                                  }`}
                                >
                                  <span>{src.icon}</span>
                                  <span>{src.name.split(' ')[1] || src.name.split(' ')[0]}</span>
                                  <span className={`font-mono text-[10px] ${isCurrent ? 'text-white font-bold' : (isDark ? 'text-yellow-300' : 'text-amber-700 font-bold')}`}>⏱️ {src.avgDuration}</span>
                                </button>
                              )
                            })}
                          </div>

                          {/* Primary "Kitni der ruka hai vyakti" Stay Time Display */}
                          <div className={`mt-3 p-3.5 rounded-xl border ${
                            isDark ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-amber-200 bg-amber-50/70 shadow-xs'
                          }`}>
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">⏱️</span>
                                <div>
                                  <div className={`text-[11px] font-bold uppercase tracking-wider ${
                                    isDark ? 'text-yellow-300/90' : 'text-amber-900 font-extrabold'
                                  }`}>
                                    Ausatan Rukne Ka Samay (Average Dwell Time)
                                  </div>
                                  <div className={`text-2xl sm:text-3xl font-black font-mono ${
                                    isDark ? 'text-yellow-300' : 'text-amber-800'
                                  }`}>
                                    {activeSubSource.avgDuration}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                                  isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                }`}>
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                  <span>🟢 {activeSubSource.liveCount} Online Now</span>
                                </div>
                                <div className={`text-[11px] font-mono mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                                  Total Engaged: <strong className={isDark ? 'text-zinc-200' : 'text-slate-900'}>{activeSubSource.totalHours}</strong>
                                </div>
                              </div>
                            </div>

                            {/* Clear Hindi Explanation */}
                            <div className={`mt-2.5 pt-2 border-t text-xs leading-relaxed ${
                              isDark ? 'border-yellow-500/20 text-zinc-200' : 'border-amber-200 text-slate-800 font-medium'
                            }`}>
                              💡 <strong className={isDark ? 'text-white' : 'text-slate-900'}>Report:</strong> {activeSubSource.hindiReport}
                            </div>
                          </div>

                          {/* Behavioral Metrics Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                            <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-white/5 border-[#26282e]' : 'bg-slate-50 border-slate-200'}`}>
                              <div className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Total Visitors</div>
                              <div className={`text-sm font-black font-mono mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeSubSource.count.toLocaleString()}</div>
                              <div className={`text-[10px] font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{activeSubSource.percent}% of all traffic</div>
                            </div>

                            <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-white/5 border-[#26282e]' : 'bg-slate-50 border-slate-200'}`}>
                              <div className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Pages per Visit</div>
                              <div className={`text-sm font-black font-mono mt-0.5 ${isDark ? 'text-cyan-300' : 'text-sky-700'}`}>{activeSubSource.pagesPerVisit} Pages</div>
                              <div className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Listings explored</div>
                            </div>

                            <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-white/5 border-[#26282e]' : 'bg-slate-50 border-slate-200'}`}>
                              <div className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Bounce Rate</div>
                              <div className={`text-sm font-black font-mono mt-0.5 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{activeSubSource.bounceRate}</div>
                              <div className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Low bounce = engaged</div>
                            </div>

                            <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-white/5 border-[#26282e]' : 'bg-slate-50 border-slate-200'}`}>
                              <div className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Claim/Bid Clicks</div>
                              <div className={`text-sm font-black font-mono mt-0.5 ${isDark ? 'text-yellow-300' : 'text-amber-700'}`}>{activeSubSource.conversionRate}</div>
                              <div className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Purchase intent</div>
                            </div>
                          </div>

                          {/* Stay Duration Breakdown ("Kitni der rukte hain log") */}
                          <div className={`mt-3 p-3 rounded-xl border ${isDark ? 'bg-white/5 border-[#26282e]' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                              <span className={isDark ? 'text-zinc-300' : 'text-slate-800'}>⏱️ Kitni Der Rukte Hain Log (Stay Duration Breakdown)</span>
                              <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Total 100% distribution</span>
                            </div>

                            {/* Segmented bar */}
                            <div className={`h-3 w-full rounded-full overflow-hidden flex ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}>
                              <div
                                style={{ width: `${activeSubSource.distribution.under30s}%` }}
                                className="bg-zinc-500 transition-all"
                                title={`< 30s: ${activeSubSource.distribution.under30s}%`}
                              />
                              <div
                                style={{ width: `${activeSubSource.distribution.under2m}%` }}
                                className="bg-sky-400 transition-all"
                                title={`30s - 2m: ${activeSubSource.distribution.under2m}%`}
                              />
                              <div
                                style={{ width: `${activeSubSource.distribution.under5m}%` }}
                                className="bg-emerald-400 transition-all"
                                title={`2m - 5m: ${activeSubSource.distribution.under5m}%`}
                              />
                              <div
                                style={{ width: `${activeSubSource.distribution.over5m}%` }}
                                className="bg-amber-400 transition-all"
                                title={`5m+: ${activeSubSource.distribution.over5m}%`}
                              />
                            </div>

                            {/* Bar legend */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5 text-[10px] font-mono">
                              <div className={`flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                                <span className="w-2 h-2 rounded-xs bg-zinc-500 inline-block"></span>
                                <span>&lt; 30s: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeSubSource.distribution.under30s}%</strong></span>
                              </div>
                              <div className={`flex items-center gap-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                                <span className="w-2 h-2 rounded-xs bg-sky-400 inline-block"></span>
                                <span>30s-2m: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeSubSource.distribution.under2m}%</strong></span>
                              </div>
                              <div className={`flex items-center gap-1.5 ${isDark ? 'text-emerald-300' : 'text-slate-600'}`}>
                                <span className="w-2 h-2 rounded-xs bg-emerald-400 inline-block"></span>
                                <span>2m-5m: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeSubSource.distribution.under5m}%</strong></span>
                              </div>
                              <div className={`flex items-center gap-1.5 ${isDark ? 'text-amber-300' : 'text-slate-600'}`}>
                                <span className="w-2 h-2 rounded-xs bg-amber-400 inline-block"></span>
                                <span>5m+: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeSubSource.distribution.over5m}%</strong></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Expanded All Channels Details List */}
                      {showChannelDetails && (
                        <div className="mt-4 pt-3 border-t border-[#26282e] space-y-2 animate-fadeIn">
                          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 px-1">
                            <span>{tt.channelSourceCol}</span>
                            <span>{tt.dwellVisitsCol}</span>
                          </div>
                          {Object.values(channelsMap).map((chan, idx) => {
                            const isSelected = selectedChannelId === chan.id
                            const isHovered = hoveredDonutChannel === chan.id
                            const defaultDrill = chan.id === 'organic_social' ? 'x_twitter'
                              : chan.id === 'organic_search' ? 'google'
                              : chan.id === 'referral' ? 'producthunt'
                              : 'direct'
                            return (
                              <div
                                key={chan.id || idx}
                                onMouseEnter={() => setHoveredDonutChannel(chan.id)}
                                onMouseLeave={() => setHoveredDonutChannel(null)}
                                onClick={() => {
                                  const nextId = clickedDonutChannel === chan.id ? null : chan.id
                                  setSelectedChannelId(nextId)
                                  setClickedDonutChannel(nextId)
                                  if (nextId) setSelectedDrilldownSourceId(defaultDrill)
                                }}
                                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                                  isSelected || isHovered
                                    ? 'border-[#4f8ab4] bg-[#4f8ab4]/15 shadow-sm'
                                    : 'border-[#26282e] hover:bg-white/5'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: chan.strokeColor }} />
                                  <span className="font-bold text-xs truncate">{chan.name}</span>
                                  {chan.isHighestStay && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                                      {tt.longestStayBadge}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <span className="font-mono text-yellow-300 font-bold text-xs">
                                    ⏱️ {chan.avgDuration}
                                  </span>
                                  <span className="font-mono text-white text-xs">
                                    {chan.count.toLocaleString()} ({chan.percent}%)
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      <div className="pt-3 text-center flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setShowChannelDetails(!showChannelDetails)}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all tracking-wider uppercase cursor-pointer ${
                            showChannelDetails
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'text-[#828795] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M2 5V3a1 1 0 0 1 1-1h2M11 2h2a1 1 0 0 1 1 1v2M14 11v2a1 1 0 0 1-1 1h-2M5 14H3a1 1 0 0 1-1-1v-2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>DETAILS</span>
                        </button>
                      </div>
                    </div>
                  )
                })()}

                {/* CARD 2: Hostname, Page, Entry Page, Exit Link */}
                {(dataFastTab === 'all' || dataFastTab === 'paths') && (
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isDark ? 'bg-[#18191c] border-[#26282e]' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#26282e]">
                        <div
                          className={`p-0.5 rounded-xl flex items-center overflow-x-auto gap-1 ${
                            isDark ? 'bg-transparent' : 'bg-slate-100'
                          }`}
                        >
                          {(['hostname', 'page', 'entry_page', 'exit_link'] as const).map((tab) => {
                            const labels: Record<string, string> = {
                              hostname: tt.pillHostname,
                              page: tt.pillPage,
                              entry_page: tt.pillEntryPage,
                              exit_link: tt.pillExitLink,
                            }
                            return (
                              <button
                                key={tab}
                                type="button"
                                onClick={() => setPagePillTab(tab)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                                  pagePillTab === tab
                                    ? isDark ? 'bg-[#26282e] text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs'
                                    : isDark ? 'text-[#828795] hover:text-white' : 'text-slate-500 hover:text-slate-900'
                                }`}
                              >
                                {labels[tab]}
                              </button>
                            )
                          })}
                        </div>

                        <span className="text-[11px] font-mono text-zinc-400 ml-2">
                          {tt.allLabel} ({(trackingDetails?.totalVisits ?? 7633).toLocaleString()}) ⌄
                        </span>
                      </div>

                      {/* Page Rows */}
                      {pagePillTab === 'page' && (() => {
                        const pages: any[] = trackingDetails?.pagesExtended?.pages || trackingDetails?.paths || []
                        const maxCount = Math.max(...pages.map((p: any) => p.count), 1)

                        return (
                          <div className="space-y-2">
                            {pages.map((p: any, idx: number) => {
                              const barWidth = Math.max(6, Math.round((p.count / maxCount) * 100))
                              const isSelected = selectedPageItem?.path === p.path

                              return (
                                <div
                                  key={idx}
                                  onClick={() => setSelectedPageItem(isSelected ? null : p)}
                                  className={`relative overflow-hidden rounded-xl p-2.5 flex items-center justify-between text-xs transition-all cursor-pointer group border ${
                                    isSelected
                                      ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                                      : isDark ? 'border-transparent hover:border-purple-500/30 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <div
                                    className={`absolute inset-y-0 left-0 rounded-xl transition-all duration-500 pointer-events-none ${
                                      isDark ? 'bg-sky-400/20' : 'bg-sky-100/90'
                                    }`}
                                    style={{ width: `${barWidth}%` }}
                                  />

                                  <div className="relative z-10 flex items-center gap-2 min-w-0 pr-2">
                                    <span className="font-mono font-bold text-xs truncate text-cyan-300">
                                      {p.path}
                                    </span>
                                    {p.isHighestStay && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black whitespace-nowrap">
                                        {tt.longestStayBadge} ({p.avgDuration})
                                      </span>
                                    )}
                                  </div>

                                  <div className="relative z-10 flex items-center gap-3 flex-shrink-0">
                                    <span className="font-mono font-bold text-[11px] text-yellow-300" title="Customer stay duration on this page">
                                      ⏱️ {p.avgDuration}
                                    </span>
                                    <span className="font-mono font-black text-xs text-white">
                                      {p.count >= 1000 ? `${(p.count / 1000).toFixed(1)}k` : p.count.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )
                      })()}

                      {/* Hostname Tab */}
                      {pagePillTab === 'hostname' && (() => {
                        const hostnames: any[] = trackingDetails?.pagesExtended?.hostnames || []
                        return (
                          <div className="space-y-2">
                            {hostnames.map((h, idx) => (
                              <div
                                key={idx}
                                onClick={() => setSelectedPageItem(h)}
                                className="p-2.5 rounded-xl border border-purple-500/20 flex items-center justify-between text-xs cursor-pointer hover:bg-white/5"
                              >
                                <span className="font-mono font-bold text-cyan-300">{h.hostname}</span>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-yellow-300 font-bold">⏱️ {h.avgDuration}</span>
                                  <span className="font-mono font-black text-white">{h.count.toLocaleString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      })()}

                      {/* Entry Page Tab */}
                      {pagePillTab === 'entry_page' && (() => {
                        const entryPages: any[] = trackingDetails?.pagesExtended?.entryPages || []
                        return (
                          <div className="space-y-2">
                            {entryPages.map((ep, idx) => (
                              <div
                                key={idx}
                                onClick={() => setSelectedPageItem(ep)}
                                className="p-2.5 rounded-xl border border-purple-500/20 flex items-center justify-between text-xs cursor-pointer hover:bg-white/5"
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-bold text-cyan-300">{ep.path}</span>
                                  {ep.isHighestStay && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                      {tt.longestStayBadge}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-yellow-300 font-bold">⏱️ {ep.avgDuration}</span>
                                  <span className="font-mono font-black text-white">{ep.count.toLocaleString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      })()}

                      {/* Exit Link Tab */}
                      {pagePillTab === 'exit_link' && (() => {
                        const exitLinks: any[] = trackingDetails?.pagesExtended?.exitLinks || []
                        return (
                          <div className="space-y-2">
                            {exitLinks.map((ex, idx) => (
                              <div
                                key={idx}
                                onClick={() => setSelectedPageItem(ex)}
                                className="p-2.5 rounded-xl border border-purple-500/20 flex items-center justify-between text-xs cursor-pointer hover:bg-white/5"
                              >
                                <span className="font-mono font-bold text-cyan-300 truncate max-w-[200px]">{ex.label || ex.link}</span>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-yellow-300 font-bold">⏱️ {ex.avgDuration} {tt.stayedLabel}</span>
                                  <span className="font-mono font-black text-white">{ex.count.toLocaleString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      })()}

                      {/* Selected Page Dwell Time Detail Box */}
                      {selectedPageItem && (
                        <div className="mt-3 p-3 rounded-xl border border-cyan-500/40 bg-cyan-950/20 text-cyan-200 text-xs animate-fadeIn">
                          <div className="flex items-center justify-between mb-1">
                            <strong className="font-black text-yellow-300 flex items-center gap-1.5">
                              <span>{tt.dwellDetailsTitle}</span>
                              <span>{selectedPageItem.path || selectedPageItem.hostname || selectedPageItem.label}</span>
                            </strong>
                            <button
                              type="button"
                              onClick={() => setSelectedPageItem(null)}
                              className="text-zinc-400 hover:text-white cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-[11px] text-zinc-300">
                            {tt.dwellDetailsMsg} <strong className="text-white">{selectedPageItem.avgDuration || '2m 15s'}</strong>.
                            {selectedPageItem.isHighestStay ? ` ${tt.dwellDetailsTopMsg}` : ''}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 text-center border-t border-purple-500/10 mt-3">
                      <span className="text-[10px] text-zinc-400">
                        {tt.pageClickInspectHint}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* GRID FOR LOCATIONS & SYSTEMS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SECTION 4: Locations Card */}
                {(dataFastTab === 'all' || dataFastTab === 'locations') && (
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark ? 'bg-[#10111e] border-purple-500/25' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-500/15">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs sm:text-sm font-bold">{tt.locationsTitle}</h4>
                      </div>
                      <div
                        className={`p-0.5 rounded-lg border text-[10px] font-bold flex items-center ${
                          isDark ? 'bg-[#080911] border-purple-500/30' : 'bg-slate-100 border-slate-300'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setLocationSubTab('country')}
                          className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                            locationSubTab === 'country' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-zinc-400'
                          }`}
                        >
                          {tt.pillCountry}
                        </button>
                        <button
                          type="button"
                          onClick={() => setLocationSubTab('region')}
                          className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                            locationSubTab === 'region' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-zinc-400'
                          }`}
                        >
                          {tt.pillRegion}
                        </button>
                        <button
                          type="button"
                          onClick={() => setLocationSubTab('city')}
                          className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                            locationSubTab === 'city' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-zinc-400'
                          }`}
                        >
                          {tt.pillCity}
                        </button>
                      </div>
                    </div>

                    {/* Country List */}
                    {locationSubTab === 'country' && (() => {
                      const countries = trackingDetails?.countries || []
                      const maxCount = Math.max(...countries.map((c: any) => c.count), 1)
                      const displayed = showAllCountries ? countries : countries.slice(0, 7)

                      return (
                        <div className="space-y-1.5">
                          {displayed.map((c: any, idx: number) => {
                            const barWidth = Math.max(6, Math.round((c.count / maxCount) * 100))
                            return (
                              <div
                                key={c.code || idx}
                                className={`relative overflow-hidden rounded-xl p-2 flex items-center justify-between text-xs transition-all group ${
                                  isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                                }`}
                              >
                                <div
                                  className={`absolute inset-y-0 left-0 rounded-xl transition-all duration-500 ${
                                    isDark ? 'bg-sky-500/15' : 'bg-sky-100/90'
                                  }`}
                                  style={{ width: `${barWidth}%` }}
                                />
                                <div className="relative z-10 flex items-center gap-2 min-w-0 pr-2">
                                  <span className="text-base select-none leading-none">{c.flag}</span>
                                  <span className="font-bold truncate text-xs">{c.country}</span>
                                </div>
                                <div className="relative z-10 flex items-center gap-2 flex-shrink-0">
                                  <span className="font-mono font-black text-xs text-white">
                                    {c.count.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 font-medium">
                                    {c.percent}%
                                  </span>
                                </div>
                              </div>
                            )
                          })}

                          {countries.length > 7 && (
                            <div className="pt-1 text-center">
                              <button
                                type="button"
                                onClick={() => setShowAllCountries(!showAllCountries)}
                                className="px-3 py-1 rounded-full text-[10px] font-black uppercase text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors border border-cyan-500/20 cursor-pointer"
                              >
                                <span>{showAllCountries ? tt.showLess : tt.showAllCountries}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })()}

                    {/* Region List */}
                    {locationSubTab === 'region' && (() => {
                      const regions = trackingDetails?.regions || []
                      const maxCount = Math.max(...regions.map((r: any) => r.count), 1)

                      return (
                        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                          {regions.map((r: any, idx: number) => {
                            const barWidth = Math.max(6, Math.round((r.count / maxCount) * 100))
                            return (
                              <div
                                key={idx}
                                className="relative overflow-hidden rounded-xl p-2 flex items-center justify-between text-xs"
                              >
                                <div
                                  className={`absolute inset-y-0 left-0 rounded-xl transition-all duration-500 ${
                                    isDark ? 'bg-teal-500/15' : 'bg-teal-100/90'
                                  }`}
                                  style={{ width: `${barWidth}%` }}
                                />
                                <div className="relative z-10 flex items-center gap-2 min-w-0 pr-2">
                                  <span className="text-sm">🗺️</span>
                                  <span className="font-bold truncate text-xs">{r.region}</span>
                                  <span className="text-[10px] text-zinc-400 truncate">({r.country})</span>
                                </div>
                                <div className="relative z-10 flex items-center gap-2 flex-shrink-0">
                                  <span className="font-mono font-black text-xs text-teal-400">
                                    {r.count.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })()}

                    {/* City List */}
                    {locationSubTab === 'city' && (() => {
                      const cities = trackingDetails?.cities || []
                      const maxCount = Math.max(...cities.map((ct: any) => ct.count), 1)

                      return (
                        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                          {cities.map((ct: any, idx: number) => {
                            const barWidth = Math.max(6, Math.round((ct.count / maxCount) * 100))
                            return (
                              <div
                                key={idx}
                                className="relative overflow-hidden rounded-xl p-2 flex items-center justify-between text-xs"
                              >
                                <div
                                  className={`absolute inset-y-0 left-0 rounded-xl transition-all duration-500 ${
                                    isDark ? 'bg-emerald-500/15' : 'bg-emerald-100/80'
                                  }`}
                                  style={{ width: `${barWidth}%` }}
                                />
                                <div className="relative z-10 flex items-center gap-2 min-w-0 pr-2">
                                  <span className="text-sm">📍</span>
                                  <span className="font-bold truncate text-xs">{ct.city}</span>
                                  <span className="text-[10px] text-zinc-400 truncate">({ct.country})</span>
                                </div>
                                <div className="relative z-10 flex items-center gap-2 flex-shrink-0">
                                  <span className="font-mono font-black text-xs text-emerald-400">
                                    {ct.count.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* SECTION 5: Systems & Devices Card */}
                {(dataFastTab === 'all' || dataFastTab === 'systems') && (
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark ? 'bg-[#10111e] border-purple-500/25' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-500/15">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">💻</span>
                        <h4 className="text-xs sm:text-sm font-bold">{tt.systemsTitle}</h4>
                      </div>
                      <div
                        className={`p-0.5 rounded-lg border text-[10px] font-bold flex items-center ${
                          isDark ? 'bg-[#080911] border-purple-500/30' : 'bg-slate-100 border-slate-300'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSystemSubTab('browser')}
                          className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                            systemSubTab === 'browser' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-zinc-400'
                          }`}
                        >
                          {tt.pillBrowser}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSystemSubTab('os')}
                          className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                            systemSubTab === 'os' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-zinc-400'
                          }`}
                        >
                          {tt.pillOS}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSystemSubTab('device')}
                          className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                            systemSubTab === 'device' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-zinc-400'
                          }`}
                        >
                          {tt.pillDevice}
                        </button>
                      </div>
                    </div>

                    {/* Browser Sub-Tab */}
                    {systemSubTab === 'browser' && (() => {
                      const browsers = trackingDetails?.browsers || []
                      const maxCount = Math.max(...browsers.map((b: any) => b.count), 1)

                      return (
                        <div className="space-y-1.5">
                          {browsers.map((b: any, idx: number) => {
                            const barWidth = Math.max(6, Math.round((b.count / maxCount) * 100))
                            return (
                              <div
                                key={idx}
                                className="relative overflow-hidden rounded-xl p-2 flex items-center justify-between text-xs"
                              >
                                <div
                                  className={`absolute inset-y-0 left-0 rounded-xl transition-all duration-500 ${
                                    isDark ? 'bg-sky-500/15' : 'bg-sky-100/90'
                                  }`}
                                  style={{ width: `${barWidth}%` }}
                                />
                                <div className="relative z-10 flex items-center gap-2">
                                  <span className="text-sm">🌐</span>
                                  <span className="font-bold text-xs">{b.browser}</span>
                                </div>
                                <div className="relative z-10 flex items-center gap-2">
                                  <span className="font-mono font-black text-xs text-white">
                                    {b.count.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 font-medium">
                                    {b.percent}%
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })()}

                    {/* OS Sub-Tab */}
                    {systemSubTab === 'os' && (() => {
                      const osList = trackingDetails?.os || []
                      const maxCount = Math.max(...osList.map((o: any) => o.count), 1)

                      return (
                        <div className="space-y-1.5">
                          {osList.map((o: any, idx: number) => {
                            const barWidth = Math.max(6, Math.round((o.count / maxCount) * 100))
                            return (
                              <div
                                key={idx}
                                className="relative overflow-hidden rounded-xl p-2 flex items-center justify-between text-xs"
                              >
                                <div
                                  className={`absolute inset-y-0 left-0 rounded-xl transition-all duration-500 ${
                                    isDark ? 'bg-indigo-500/15' : 'bg-indigo-100/90'
                                  }`}
                                  style={{ width: `${barWidth}%` }}
                                />
                                <div className="relative z-10 flex items-center gap-2">
                                  <span className="text-sm">⚙️</span>
                                  <span className="font-bold text-xs">{o.os}</span>
                                </div>
                                <div className="relative z-10 flex items-center gap-2">
                                  <span className="font-mono font-black text-xs text-indigo-400">
                                    {o.count.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 font-medium">
                                    {o.percent}%
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })()}

                    {/* Device Sub-Tab */}
                    {systemSubTab === 'device' && (() => {
                      const devices = trackingDetails?.devices || []
                      const maxCount = Math.max(...devices.map((d: any) => d.count), 1)

                      return (
                        <div className="space-y-1.5">
                          {devices.map((d: any, idx: number) => {
                            const barWidth = Math.max(6, Math.round((d.count / maxCount) * 100))
                            const icon = d.device === 'Mobile' ? '📱' : d.device === 'Tablet' ? '📟' : '💻'
                            return (
                              <div
                                key={idx}
                                className="relative overflow-hidden rounded-xl p-2 flex items-center justify-between text-xs"
                              >
                                <div
                                  className={`absolute inset-y-0 left-0 rounded-xl transition-all duration-500 ${
                                    isDark ? 'bg-amber-500/15' : 'bg-amber-100/80'
                                  }`}
                                  style={{ width: `${barWidth}%` }}
                                />
                                <div className="relative z-10 flex items-center gap-2">
                                  <span className="text-sm">{icon}</span>
                                  <span className="font-bold text-xs">{d.device}</span>
                                </div>
                                <div className="relative z-10 flex items-center gap-2">
                                  <span className="font-mono font-black text-xs text-yellow-400">
                                    {d.count.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 font-medium">
                                    {d.percent}%
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>

              {/* SECTION 6: Conversions & Custom Events */}
              {(dataFastTab === 'all' || dataFastTab === 'events') && (
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    isDark ? 'bg-[#10111e] border-purple-500/25' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-500/15">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🎯</span>
                      <h4 className="text-xs sm:text-sm font-bold">{tt.goalsTitle}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">{tt.triggeredLabel}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {(trackingDetails?.events || []).map((ev: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isDark ? 'bg-[#0b0c16] border-purple-500/20' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span className="text-sm flex-shrink-0">{ev.icon}</span>
                          <span className="text-xs font-bold truncate">{ev.event}</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="font-mono font-black text-xs text-yellow-400 block">
                            {ev.count.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-zinc-400">{ev.percent}% cr</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 7: Live Real-Time Visitor Stream Feed */}
              {(dataFastTab === 'all' || dataFastTab === 'stream') && (
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#10111e] border-purple-500/20' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-500/15">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-xs sm:text-sm font-bold">{tt.streamTitle}</h4>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-400">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      <span>{tt.autoUpdating}</span>
                    </div>
                  </div>

                  {trackingLoading ? (
                    <div className="py-6 text-center text-xs text-zinc-400">
                      <Loader2 className="w-4 h-4 animate-spin mx-auto text-cyan-400 mb-1" />
                      {tt.syncingStream}
                    </div>
                  ) : trackingDetails?.recentVisits && trackingDetails.recentVisits.length > 0 ? (
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {trackingDetails.recentVisits.map((v: any, idx: number) => {
                        const timeAgo = (() => {
                          try {
                            const diff = Math.floor((Date.now() - new Date(v.time).getTime()) / 1000)
                            if (diff < 10) return tt.timeJustNow
                            if (diff < 60) return `${diff} ${tt.timeSecAgo}`
                            if (diff < 3600) return `${Math.floor(diff / 60)} ${tt.timeMinAgo}`
                            return `${Math.floor(diff / 3600)} ${tt.timeHourAgo}`
                          } catch {
                            return tt.timeRecently
                          }
                        })()

                        return (
                          <div
                            key={v.id || idx}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all ${
                              idx === 0
                                ? isDark ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-300'
                                : isDark ? 'bg-[#090a12] border-purple-500/10' : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-base select-none flex-shrink-0">{v.flag || '🇮🇳'}</span>
                              <div className="min-w-0 truncate">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-xs truncate">
                                    {v.country || 'India'}{v.city ? `, ${v.city}` : ''}
                                  </span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                                    {v.device === 'Mobile' ? tt.deviceMobile : v.device === 'Tablet' ? tt.deviceTablet : tt.deviceDesktop}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
                                  <span>{v.maskedIp}</span>
                                  <span>•</span>
                                  <span className="truncate max-w-[120px] sm:max-w-[200px]">{v.referer}</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-cyan-400 whitespace-nowrap flex-shrink-0">
                              {timeAgo}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-zinc-400 space-y-1">
                      <p>{tt.noVisitsYet}</p>
                      <p className="text-[11px] text-cyan-400 font-bold">
                        {tt.testHint}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )

  if (isEmbedded) {
    return dashboardCard
  }

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto animate-fadeIn ${
        isTrackingFullscreen
          ? 'w-full h-full min-h-screen bg-[#07080e]'
          : 'flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md'
      }`}
    >
      {dashboardCard}
    </div>
  )
}
