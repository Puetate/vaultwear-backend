import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateReportDto } from "./dto/create-report.dto";
import { ReportsService } from "./reports.service";

@ApiTags("reports")
@ApiBearerAuth()
@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get("statistics")
  statistics() {
    return this.reportsService.statistics();
  }
}
