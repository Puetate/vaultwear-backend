import dayjsLib from "dayjs";
import es from "dayjs/locale/es-mx";
import isBetween from "dayjs/plugin/isBetween";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjsLib.locale(es);
dayjsLib.extend(utc);
dayjsLib.extend(timezone);
dayjsLib.extend(isBetween);
dayjsLib.tz.setDefault("America/Guayaquil");

export const dayjs = dayjsLib.tz;
