import { dayjs } from "@commons/libs";
import { DrizzleAdapter } from "@modules/drizzle/drizzle.provider";
import { order, person, user } from "@modules/drizzle/schema";
import { TransactionHost } from "@nestjs-cls/transactional";
import { Injectable } from "@nestjs/common";
import { and, between, count, eq, isNull, sum } from "drizzle-orm";
import { CreateReportDto } from "./dto/create-report.dto";

@Injectable()
export class ReportsService {
  constructor(private readonly txHost: TransactionHost<DrizzleAdapter>) {}

  create(createReportDto: CreateReportDto) {
    return "This action adds a new report";
  }

  async statistics() {
    const startDate = dayjs().startOf("month").toDate();
    const endDate = dayjs().endOf("month").toDate();
    const ordersCompletedThisMonthPromise = this.txHost.tx
      .select({
        count: count()
      })
      .from(order)
      .where(and(between(order.createdAt, startDate, endDate), eq(order.completed, true)));

    const ordersPendingThisMonthPromise = this.txHost.tx
      .select({
        count: count()
      })
      .from(order)
      .where(and(between(order.createdAt, startDate, endDate), eq(order.completed, true)));

    const personCountPromise = this.txHost.tx
      .select({
        count: count()
      })
      .from(person)
      .leftJoin(user, eq(person.personID, user.personID))
      .where(and(isNull(user.personID), between(person.createdAt, startDate, endDate)));

    const userCount = this.txHost.tx
      .select({
        count: count()
      })
      .from(user);

    const salesThisMonth = this.txHost.tx
      .select({
        sum: sum(order.total)
      })
      .from(order)
      .where(between(order.createdAt, startDate, endDate));

    const totalSales = this.txHost.tx
      .select({
        sum: sum(order.total)
      })
      .from(order);

    const [
      ordersPendingThisMonthCount,
      ordersCompletedThisMonthCount,
      personsCount,
      usersCount,
      sales,
      total
    ] = await Promise.all([
      ordersPendingThisMonthPromise,
      ordersCompletedThisMonthPromise,
      personCountPromise,
      userCount,
      salesThisMonth,
      totalSales
    ]);

    return {
      usersCount: usersCount[0].count,
      clientsCount: personsCount[0].count,
      ordersCompletedThisMonthCount: ordersCompletedThisMonthCount[0].count,
      ordersPendingThisMonthCount: ordersPendingThisMonthCount[0].count,
      salesThisMonth: sales[0].sum,
      totalSales: total[0].sum
    };
  }
}
