import {
    format,
    isToday,
    isYesterday,
    differenceInDays,
} from "date-fns";
import { tr } from "date-fns/locale";

export function formatChatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();

    if (isToday(date)) {
        return format(date, "HH:mm");
    }

    if (isYesterday(date)) {
        return "Dün";
    }

    const diff = differenceInDays(now, date);

    if (diff < 7) {
        return format(date, "EEEE", { locale: tr });
    }

    return format(date, "dd.MM.yyyy");
}