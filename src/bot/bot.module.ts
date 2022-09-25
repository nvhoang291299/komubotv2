import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { CompantripCommand } from "./commands/companytrip/companytrip.command";

import { MeetingCommand } from "./commands/meeting/meeting.command";
import { MeetingService } from "./commands/meeting/meeting.service";
import { RemindCommand } from "./commands/remind/remind.command";
import { UserStatusCommand } from "./commands/user_status/user_status.command";
import { UserStatusService } from "./commands/user_status/user_status.service";
import { WFHCommand } from "./commands/wfh/wfh.command";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule as NestjsScheduleModule } from "@nestjs/schedule";
import { TimeSheetCommand } from "./commands/timesheet/timesheet.command";
import { BotGateway } from "./events/bot.gateway";
import { Daily } from "./models/daily.entity";
import { Holiday } from "./models/holiday.entity";
import { Leave } from "./models/leave.entity";
import { Meeting } from "./models/meeting.entity";
import { Msg } from "./models/msg.entity";
import { Remind } from "./models/remind.entity";
import { User } from "./models/user.entity";
import { VoiceChannels } from "./models/voiceChannel.entity";
import { WorkFromHome } from "./models/wfh.entity";
import { MeetingSchedulerService } from "./scheduler/meeting-scheduler/meeting-scheduler.service";
import { ReminderSchedulerService } from "./scheduler/reminder-scheduler/reminder-scheduler.service";
import { SendMessageSchedulerService } from "./scheduler/send-message-scheduler/send-message-scheduler.service";
import { PlaySlashCommand } from "./slash-commands/play.slashcommand";
import { PlaylistSlashCommand } from "./slash-commands/playlist.slashcommand";
import { NotifiService } from "./commands/notification/noti.service";
import { ToggleActiveCommand } from "./commands/toggleActive/toggleActive.command";
import { ToggleActiveService } from "./commands/toggleActive/toggleActive.service";
import { CheckListModule } from "./utils/checklist/checklist.module";
import { MulterModule } from "@nestjs/platform-express";
import { UtilsModule } from "./utils/utils.module";
import { GemrankCommand } from "./commands/gemrank.command";
import { MoveChannelCommand } from "./commands/move_channel/move_channel.command";
import LeaveCommand from "./commands/leave/leave.command";
import { LeaveService } from "./commands/leave/leave.service";
import { ReportWFHModule } from "./utils/reportWFH/report-wfh.module";
import { PollCommand } from "./commands/poll/poll.command";
import { PollEmbedUntil } from "./utils/poll/pollEmbed.until";
import { ConfigService } from "@nestjs/config";
import { Opentalk } from "./models/opentalk.entity";
import { Uploadfile } from "./models/uploadFile.entity";
import { ReportOrderModule } from "./utils/reportOrder/reportOrder.module";
import { ReportCommand } from "./commands/report/report.command";
import { ReportOrderService } from "./utils/reportOrder/reportOrder.service";
import { UtilsService } from "./utils/utils.service";
// import { ReportOrder } from "./utils/reportOrder.utils";
import HolidayCommand from "./commands/holiday/holiday.command";
import { Order } from "./models/order.entity";
import { HolidayService } from "./commands/holiday/holiday.service";
import Ncc8Command from "./commands/ncc8/ncc8.command";
// import { CheckListController } from "./commands/Checklist/checklist.controller";
import { CompanyTrip } from "./models/companyTrip.entity";
import { CompanytripService } from "./commands/companytrip/companytrip.service";
import { PingCommand } from "./commands/ping/ping";
import { KomubotrestController } from "./utils/komubotrest/komubotrest.controller";
import { OpenTalkService } from "./commands/open-talk/open-talk.service";
import NotificationCommand from "./commands/notification/noti.command";
import { OrderCommand } from "./commands/order/order.command";
import { OrderService } from "./commands/order/order.service";
import { MoveChannelService } from "./commands/move_channel/move_channel.service";
import { CheckList } from "./models/checklistdata.entity";
import { Subcategorys } from "./models/subcategoryData.entity";
import { Channel } from "./models/channel.entity";
import { ReportTracker } from "./utils/report-tracker.untils";
import { ReportHolidayService } from "./utils/reportHoliday/reportHoliday.service";
import { ReportOpenTalkService } from "./utils/reportOpentalk/reportOpentalk.service";
import { AudioPlayer } from "./utils/audioPlayer.utils";
import { ReportDailyService } from "./utils/reportDaily/report-daily.service";
import { ReportMentionModule } from "./utils/reportMention/reportMention.module";
import { ClientConfigService } from "./config/client-config.service";
import { ReportWomenDayService } from "./utils/reportWomenDay/reportWomenDay.service";
import { ReportWomenDayModule } from "./utils/reportWomenDay/reportWomenDay.module";
import { WomenDay } from "./models/womenDay.entity";
import { ReportCheckoutService } from "./utils/reportCheckout/reportCheckout.service";
import { ReportCheckoutModule } from "./utils/reportCheckout/reportCheckout.module";
import { UserNotDailyService } from "./utils/getUserNotDaily/getUserNotDaily.service";
import { ReportScoreModule } from "./utils/reportScore/report-score.module";
import { ReportScoreService } from "./utils/reportScore/report-score.service";
import { Tx8Command } from "./commands/tx8/tx8.command";
import { TX8 } from "./models/tx8.entity";
import { LinksCommand } from "./utilities/links.command";
import { AvatarCommand } from "./utilities/avatar.command";
import { UserInfoCommand } from "./utilities/userInfo.command";
import { BirthDay } from "./models/birthday.entity";
import { BirthdayService } from "./utils/birthday/birthdayservice";
import { UpdateCommand } from "./commands/update/update.command";
import { UserQuiz } from "./models/userQuiz";
import { DatingSchedulerService } from "./scheduler/dating-scheduler/dating-scheduler.service";
import { Dating } from "./models/dating.entity";
import { JoinCall } from "./models/joinCall.entity";
import { MvChannelCommand } from "./commands/mvChannel/mvChannel.command";
import { Sync_role } from "./commands/sync_roles/sync_role.command";
import { Sync_roleDiscord } from "./commands/sync_rolediscord/sync_rolediscord";
import { UpdateRole } from "./utils/roles.utils";
import { DailyCommand } from "./commands/daily/daily.command";
import holidayCommand from "./commands/holiday/holiday.command";
import { DailyService } from "./commands/daily/daily.service";
import { ReportCheckCameraService } from "./utils/reportCheckCamera/reportCheckCamera.service";
import { CheckCamera } from "./models/checkCamera.entity";
import { Client } from "discord.js";
import { OdinReportService } from "./utils/odinReport/odinReport.service";
import { KickbotCommand } from "./commands/kickbot/kickbot.command";
import { AntCommand } from "./commands/ant.command copy";
import { WolCommand } from "./commands/wol.command copy 2";
import { ReportTrackerService } from "./utils/reportTracker/reportTracker.service";
import { TrackerSpentTime } from "./models/trackerSpentTime.entity";
import { UpdateRoleSchedulerService } from "./scheduler/updateRole-scheduler/updateRole-scheduler.service";

@Module({
  imports: [
    DiscordModule.forFeature(),
    MulterModule.register({
      dest: "./files",
    }),
    DiscoveryModule,
    TypeOrmModule.forFeature([
      Daily,
      Order,
      Leave,
      Holiday,
      User,
      Meeting,
      VoiceChannels,
      WorkFromHome,
      Msg,
      Remind,
      Uploadfile,
      Opentalk,
      CompanyTrip,
      CheckList,
      Subcategorys,
      Channel,
      Daily,
      TX8,
      WomenDay,
      BirthDay,
      UserQuiz,
      Dating,
      JoinCall,
      CheckCamera,
      TrackerSpentTime,
    ]),
    // forwardRef(() => CheckListModule),
    CheckListModule,
    NestjsScheduleModule.forRoot(),
    HttpModule,
    UtilsModule,
    ReportWFHModule,
    ReportMentionModule,
    ReportWomenDayModule,
    ReportCheckoutModule,
    ReportScoreModule,
  ],
  providers: [
    PlaySlashCommand,
    PlaylistSlashCommand,
    CompantripCommand,
    Tx8Command,
    CompanytripService,
    BotGateway,
    LeaveCommand,
    LinksCommand,
    AvatarCommand,
    UserInfoCommand,
    LeaveService,
    DailyCommand,
    MeetingCommand,
    holidayCommand,
    WFHCommand,
    RemindCommand,
    UserStatusCommand,
    PingCommand,
    UserStatusService,
    BotService,
    KomubotrestController,
    UtilsService,
    ReportTracker,
    MoveChannelCommand,
    TimeSheetCommand,
    OpenTalkService,
    MeetingSchedulerService,
    DatingSchedulerService,
    ReminderSchedulerService,
    SendMessageSchedulerService,
    MeetingService,
    ToggleActiveCommand,
    ToggleActiveService,
    NotifiService,
    NotificationCommand,
    OrderCommand,
    PollCommand,
    OrderService,
    ReportCommand,
    ReportOrderService,
    ReportDailyService,
    ReportScoreService,
    HolidayService,
    Ncc8Command,
    KomubotrestController,
    CompanytripService,
    PollEmbedUntil,
    ConfigService,
    ClientConfigService,
    MoveChannelService,
    ReportHolidayService,
    ReportOpenTalkService,
    AudioPlayer,
    ReportWomenDayService,
    ReportCheckoutService,
    UserNotDailyService,
    BirthdayService,
    UpdateCommand,
    MvChannelCommand,
    Sync_role,
    Sync_roleDiscord,
    UpdateRole,
    DailyService,
    ReportCheckCameraService,
    OdinReportService,
    KickbotCommand,
    AntCommand,
    WolCommand,
    ReportTrackerService,
    UpdateRoleSchedulerService,
  ],
  controllers: [BotController],
})
export class BotModule {}
