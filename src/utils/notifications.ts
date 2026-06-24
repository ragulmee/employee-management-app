import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleNotification(
  title: string,
  body: string,
  secondsFromNow: number
) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsFromNow,
    },
  });
}

export async function scheduleSalaryReviewNotification(employeeName: string) {
  await scheduleNotification(
    "💰 Salary Review Due",
    `It's time to review ${employeeName}'s salary.`,
    90 * 24 * 60 * 60
  );
}

export async function sendTestNotification() {
  await scheduleNotification(
    "👥 Employee Management",
    "Notifications are working!",
    2
  );
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}