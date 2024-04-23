import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { storage } from '../GlobalVars';
import 'intl-pluralrules';

export const resources = {
  en: {
    translation: {
      language: 'Language',
      b1: 'Connect Bluetooth',
      b2: 'Connected',
      b3: 'Click to disconnect',
      start: 'Start',
      stop: 'Stop',
      pause: 'Pause',
      resume: 'Resume',
      tr: 'Time Remaining',
      Play: 'Play',
      Mode: 'Mode',
      Settings: 'Settings',
      Home: 'Home',
      copyemail: 'Email copied.\nWaiting for your feedback!',
      fbd: "Please send your queries to: \n22038367r@connect.polyu.hk \n\nThank you so much!",
      ttt: 'Total time',
      min: 'min',
      Hot: 'Hot',
      Cold: 'Cold',
      Both: 'Alter',
      name: 'Name\t',
      inputname: 'Please input your setting name',
      conduct: 'Conduct',
      cycles: 'Cycles',
      save: 'Save',
      reset: 'Reset',
      um: "User Manual",
      cus: "Customization",
      deletemode: 'Confirm delete mode?',
      deleteconfirm: 'Are you sure you want to delete this mode?',
      modelocked: 'This mode is locked and cannot be deleted.',
      temprange: 'Temp range',
      haf: 'Help & Feedback',
      bleError: 'Bluetooth connection failed, please try again.',
      pleaseConnectBLE: 'Please connect to Bluetooth device first',
      ConnectionUnstable: 'Connection unstable...',

    },
  },
  zh: {
    translation: {
      language: '语言',
      b1: '连接蓝牙',
      b2: '蓝牙已连接',
      b3: '点击断开连接',
      start: '开始',
      stop: '停止',
      pause: '暂停',
      resume: '继续',
      tr: '剩余时间',
      Play: '播放',
      Mode: '模式',
      Settings: '设置',
      Home: '首页',
      copyemail: '邮箱已复制。\n期待您的反馈！',
      fbd: "请发送您的问题至：\n22038367r@connect.polyu.hk \n\n非常感谢！",
      ttt: '总时间',
      min: '分钟',
      Hot: '热',
      Cold: '冷',
      Both: '热冷交替',
      name: '名称\t',
      inputname: '请输入您的设置名称',
      conduct: '执行',
      cycles: '循环',
      save: '保存',
      reset: '重置',
      um: "用户手册",
      cus: "自定义",
      deletemode: '确认删除模式？',
      deleteconfirm: '您确定要删除此模式吗？',
      modelocked: '此模式已锁定，无法删除。',
      temprange: '温度范围',
      haf: '帮助与反馈',
      bleError: '蓝牙连接失败, 请重试。',
      pleaseConnectBLE: '请先连接蓝牙设备',
      ConnectionUnstable: '连接不稳定...',

    },
  },
};




export default i18n;