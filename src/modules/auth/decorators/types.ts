import { APP_ROLES } from "@commons/constants/app-roles.constant";

export type AppRoles = (typeof APP_ROLES)[keyof typeof APP_ROLES];
