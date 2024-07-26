import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { storage } from '../GlobalVars';
import 'intl-pluralrules';

export const resources = {
  en: {
    translation: {
      Language: 'Language',
      ConnectBLE: 'Connect Bluetooth',
      ConnectedBLE: 'Connected',
      DisconnectBLE: 'Click to disconnect',
      ConfirmDisconnect:"Confirm to disconnect?",
      Start: 'Start',
      Stop: 'Stop',
      Pause: 'Pause',
      Resume: 'Resume',
      TimeRemaining: 'Time Remaining',
      Play: 'Play',
      Mode: 'Mode',
      Settings: 'Settings',
      Home: 'Home',
      CopyEmail: 'Email copied.\nWaiting for your feedback!',
      FeedBack: "Please send your queries to: \n22038367r@connect.polyu.hk \n\nThank you so much!",
      TotalTime: 'Total time',
      min: 'min',
      Hot: 'Hot',
      Cold: 'Cold',
      Both: 'Alter',
      Name: 'Name\t',
      InputName: 'Please input your setting name',
      Conduct: 'Conduct',
      Cycles: 'Cycles',
      Save: 'Save',
      Reset: 'Reset',
      UserManual: "User Manual",
      Customization: "Customization",
      DeleteMode: 'Confirm delete mode?',
      DeleteConfirm: 'Are you sure you want to delete this mode?',
      ModeLocked: 'This mode is locked and cannot be deleted.',
      TempRange: 'Temp range',
      HelpFeedback: 'Help & Feedback',
      BLEError: 'Bluetooth connection failed, please try again.',
      PleaseConnectBLE: 'Please connect to Bluetooth device first',
      ConnectionUnstable: 'Connection unstable...',
      P1: 'Low',
      P2: 'Mid',
      P3: 'High',
      Heater: 'Heater',
      Drainage: 'Drainage',
      HotFirst: 'Hot First',
      StartFailed: 'Failed to start, please try again.',
      PleaseStop: 'Please stop current mode first',
      Loading: 'Loading',
      NotCW: 'Not a CoolWear QR code',
      IsCW: 'CoolWear QR code detected, please press the button to connect',
      ScanQR: 'Scan QR',
      Pressure: 'Pressure',
      PleaseWait: 'Preparing, please wait...',
      PleaseScanQR: 'Please scan\nQR code \u2192',
      Drain: "Draining...",
      PleaseDontContinousPress: "Please don't press continuously",
      TherapyCompleted: "Therapy Completed",
      TherapyCompletedMessage: "Therapy completed, please click confirm",
      ErrorConnection: "Error in connection, please retry",
      Use: 'Use',
      CancelScan: 'Cancel Scan',
      HighTempWarningTitle: 'High Temperature Warning',
      HighTempWarning: 'High temperature may cause burns, please use with caution'
    },
  },
  zh: {
    translation: {
      Language: '语言',
      ConnectBLE: '连接蓝牙',
      ConnectedBLE: '蓝牙已连接',
      DisconnectBLE: '点击断开连接',
      ConfirmDisconnect:"确认断开连接吗？",
      Start: '开始',
      Stop: '停止',
      Pause: '暂停',
      Resume: '继续',
      TimeRemaining: '剩余时间',
      Play: '播放',
      Mode: '模式',
      Settings: '设置',
      Home: '首页',
      CopyEmail: '邮箱已复制。\n期待您的反馈！',
      FeedBack: "请发送您的问题至：\n22038367r@connect.polyu.hk \n\n非常感谢！",
      TotalTime: '总时间',
      min: '分钟',
      Hot: '热',
      Cold: '冷',
      Both: '热冷交替',
      Name: '名称\t',
      InputName: '请输入您的设置名称',
      Conduct: '执行',
      Cycles: '循环',
      Save: '保存',
      Reset: '重置',
      UserManual: "用户手册",
      Customization: "自定义",
      DeleteMode: '确认删除模式？',
      DeleteConfirm: '您确定要删除此模式吗？',
      ModeLocked: '此模式已锁定，无法删除。',
      TempRange: '温度范围',
      HelpFeedback: '帮助与反馈',
      BLEError: '蓝牙连接失败, 请重试。',
      PleaseConnectBLE: '请先连接蓝牙设备',
      ConnectionUnstable: '连接不稳定...',
      P1: '低',
      P2: '中',
      P3: '高',
      Heater: '加热',
      Drainage: '排水',
      HotFirst: '热先',
      StartFailed: '启动失败，请重试。',
      PleaseStop: '请先停止当前模式',
      Loading: '加载中',
      NotCW: '不是CoolWear二维码',
      IsCW: '检测到CoolWear二维码，请按按钮连接',
      ScanQR: '扫描\n二维码',
      Pressure: '压力',
      PleaseWait: '准备中，请稍等...',
      PleaseScanQR: '请先扫描\n二维码 \u2192',
      Drain: "排水中...",
      PleaseDontContinousPress: "请勿连续点击",
      TherapyCompleted: "疗程已完成",
      TherapyCompletedMessage: "疗程已完成，请点击确认",
      ErrorConnection: "连接错误，请重试",
      Use: '使用',
      CancelScan: '取消扫描',
      HighTempWarningTitle: '高温警告',
      HighTempWarning: '温度太高容易导致烫伤，请小心使用'
    },
  },
};




export default i18n;