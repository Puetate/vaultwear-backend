import { relations, sql } from "drizzle-orm";
import { boolean, date, decimal, integer, json, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Constants
const baseFields = {
  status: boolean().default(true),
  createdAt: timestamp({ withTimezone: true, mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date()),
  version: integer()
    .default(1)
    .$onUpdate(() => sql`version + 1`)
};

// Tables
export const person = pgTable("person", {
  personID: serial().primaryKey(),
  name: text(),
  surname: text(),
  address: text(),
  phone: text().unique(),
  identification: text("documentNumber").unique(),
  ...baseFields
});

export const role = pgTable("role", {
  roleID: serial().primaryKey(),
  roleName: text().notNull(),
  ...baseFields
});

export const user = pgTable("user", {
  userID: serial().primaryKey(),
  email: text().notNull().unique(),
  password: text().notNull(),
  personID: integer()
    .references(() => person.personID)
    .unique(),
  roleID: integer().references(() => role.roleID),
  refreshToken: text(),
  ...baseFields
});

export const order = pgTable("order", {
  orderID: serial().primaryKey(),
  userID: integer()
    .references(() => user.userID)
    .notNull(),
  orderDate: date().notNull(),
  deliveryDate: date().notNull(),
  deliveryAddress: text().notNull(),
  includeDelivery: boolean().default(false),
  total: decimal(),
  completed: boolean().default(false),
  ...baseFields
});

export const contentType = pgTable("contentType", {
  contentTypeID: serial().primaryKey(),
  contentTypeName: text().notNull(),
  ...baseFields
});

export const orderDetail = pgTable("orderDetail", {
  orderDetailID: serial().primaryKey(),
  description: text(),
  orderID: integer()
    .references(() => order.orderID)
    .notNull(),
  quantity: integer().notNull(),
  qrJson: json(),
  contents: json().$type<
    {
      contentTypeID: number;
      contentTypeName: string;
      urlContent: string;
      description: string;
    }[]
  >(),
  price: decimal().notNull(),
  orderDetailCode: text().notNull().unique(),
  ...baseFields
});

export const historicOrderDetail = pgTable("historicOrderDetail", {
  historicOderDetailID: serial().primaryKey(),
  description: text(),
  orderDetailID: integer(),
  orderID: integer(),
  quantity: integer().notNull(),
  qrJson: json(),
  contents: json().$type<
    {
      contentTypeID: number;
      contentTypeName: string;
      urlContent: string;
      description: string;
    }[]
  >(),
  price: decimal().notNull(),
  orderDetailCode: text().notNull(),
  historicType: text().notNull(),
  ...baseFields
});

// Loyalty Program

export const loyaltyCard = pgTable("loyaltyCard", {
  loyaltyCardID: serial().primaryKey(),
  quantity: integer().notNull().default(8),
  quantityClaimed: integer().notNull().default(2),
  startDate: date().notNull(),
  userID: integer().references(() => user.userID),
  ...baseFields
});

export const loyaltyCardDetail = pgTable("loyaltyCardDetail", {
  loyaltyCardDetailID: serial().primaryKey(),
  orderDetailID: integer()
    .references(() => orderDetail.orderDetailID)
    .notNull(),
  loyaltyCardID: integer().references(() => loyaltyCard.loyaltyCardID),
  claimDate: date(),
  claimCode: text().notNull(),
  qrJson: json(),
  ...baseFields
});

export const giftBox = pgTable("giftBox", {
  giftBoxID: serial().primaryKey(),
  endDate: date(),
  loyaltyCardID: integer().references(() => loyaltyCard.loyaltyCardID),
  ...baseFields
});

// Relations - ORM only
export const personRelations = relations(person, ({ one, many }) => ({
  user: one(user, {
    fields: [person.personID],
    references: [user.personID]
  })
}));

export const roleRelations = relations(role, ({ many }) => ({
  user: many(user)
}));

export const userRelations = relations(user, ({ one, many }) => ({
  person: one(person, {
    fields: [user.userID],
    references: [person.personID]
  }),
  role: one(role, {
    fields: [user.roleID],
    references: [role.roleID]
  }),
  order: many(order),
  loyaltyCard: many(loyaltyCard)
}));

export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(user, {
    fields: [order.userID],
    references: [user.userID]
  }),
  orderDetail: many(orderDetail)
}));

export const orderDetailRelations = relations(orderDetail, ({ one }) => ({
  order: one(order, {
    fields: [orderDetail.orderID],
    references: [order.orderID]
  })
}));

export const loyaltyCardRelations = relations(loyaltyCard, ({ one, many }) => ({
  user: one(user, {
    fields: [loyaltyCard.userID],
    references: [user.userID]
  }),
  loyaltyCardDetail: many(loyaltyCardDetail),
  giftBox: many(giftBox)
}));

export const loyaltyCardDetailRelations = relations(loyaltyCardDetail, ({ one }) => ({
  orderDetail: one(orderDetail, {
    fields: [loyaltyCardDetail.orderDetailID],
    references: [orderDetail.orderDetailID]
  }),
  loyaltyCard: one(loyaltyCard, {
    fields: [loyaltyCardDetail.loyaltyCardID],
    references: [loyaltyCard.loyaltyCardID]
  })
}));

export const giftBoxRelations = relations(giftBox, ({ one }) => ({
  loyaltyCard: one(loyaltyCard, {
    fields: [giftBox.loyaltyCardID],
    references: [loyaltyCard.loyaltyCardID]
  })
}));
