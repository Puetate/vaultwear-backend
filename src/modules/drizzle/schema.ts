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
  personID: integer()
    .references(() => person.personID)
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
  contentTypeID: integer()
    .references(() => contentType.contentTypeID)
    .notNull(),
  quantity: integer().notNull(),
  qrJson: json(),
  urlContent: text(),
  price: decimal().notNull(),
  orderDetailCode: text().notNull().unique(),
  ...baseFields
});

export const historicOrderDetail = pgTable("historicOrderDetail", {
  historicOderDetailID: serial().primaryKey(),
  orderDetailID: integer(),
  description: text(),
  orderID: integer(),
  contentTypeID: integer(),
  quantity: integer().notNull(),
  qrJson: json(),
  urlContent: text(),
  price: decimal().notNull(),
  orderDetailCode: text().notNull(),
  historicType: text().notNull(),
  ...baseFields
});

// Relations - ORM only
export const personRelations = relations(person, ({ one, many }) => ({
  user: one(user, {
    fields: [person.personID],
    references: [user.personID]
  }),
  order: many(order)
}));

export const roleRelations = relations(role, ({ many }) => ({
  user: many(user)
}));

export const userRelations = relations(user, ({ one }) => ({
  person: one(person, {
    fields: [user.userID],
    references: [person.personID]
  }),
  role: one(role, {
    fields: [user.roleID],
    references: [role.roleID]
  })
}));

export const orderRelations = relations(order, ({ one, many }) => ({
  person: one(person, {
    fields: [order.personID],
    references: [person.personID]
  }),
  orderDetail: many(orderDetail)
}));

export const contentTypeRelations = relations(contentType, ({ many }) => ({
  orderDetail: many(orderDetail)
}));

export const orderDetailRelations = relations(orderDetail, ({ one }) => ({
  order: one(order, {
    fields: [orderDetail.orderID],
    references: [order.orderID]
  }),
  contentType: one(contentType, {
    fields: [orderDetail.contentTypeID],
    references: [contentType.contentTypeID]
  })
}));
