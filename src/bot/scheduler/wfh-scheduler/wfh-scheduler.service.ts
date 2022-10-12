import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { UtilsService } from "../../utils/utils.service";
import { CronJob } from "cron";
import { SchedulerRegistry, CronExpression } from "@nestjs/schedule";
import { Client } from "discord.js";
import { InjectDiscordClient } from "@discord-nestjs/core";
import { User } from "src/bot/models/user.entity";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { getUserOffWork } from "src/bot/utils/getUserOffWork";
import { JoinCall } from "src/bot/models/joinCall.entity";
import { KomubotrestService } from "src/bot/utils/komubotrest/komubotrest.service";
import moment from "moment";
import { WorkFromHome } from "src/bot/models/wfh.entity";
import { ClientConfigService } from "src/bot/config/client-config.service";
import { SendQuizToSingleUserService } from "src/bot/utils/sendQuizToSingleUser/sendQuizToSingleUser.service";

@Injectable()
export class WfhSchedulerService {
  constructor(
    private utilsService: UtilsService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(JoinCall)
    private joinCallRepository: Repository<JoinCall>,
    @InjectRepository(WorkFromHome)
    private wfhRepository: Repository<WorkFromHome>,
    private schedulerRegistry: SchedulerRegistry,
    @InjectDiscordClient()
    private client: Client,
    private readonly http: HttpService,
    private sendQuizToSingleUserService: SendQuizToSingleUserService,
    private komubotrestService: KomubotrestService,
    private clientConfigService: ClientConfigService
  ) {}

  private readonly logger = new Logger(WfhSchedulerService.name);

  addCronJob(name: string, time: string, callback: () => void): void {
    const job = new CronJob(time, () => {
      this.logger.warn(`time (${time}) for job ${name} to run!`);
      callback();
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(`job ${name} added for each minute at ${time} seconds!`);
  }

  // Start cron job
  startCronJobs(): void {
    this.addCronJob("pingWfh", "*/5 9-11,13-17 * * 1-5", () =>
      this.pingWfh(this.client)
    );
    this.addCronJob("punish", "*/1 9-11,13-17 * * 1-5", () =>
      this.punish(this.client)
    );
  }

  async pingWfh(client) {
    try {
      if (await this.utilsService.checkHoliday()) return;
      console.log("[Scheduler run]");
      if (this.utilsService.checkTime(new Date())) return;
      let userOff = [];
      try {
        const { notSendUser } = await getUserOffWork(null);
        userOff = notSendUser;
      } catch (error) {
        console.log(error);
      }
      // Get user joining now
      const dataJoining = await this.joinCallRepository.find({
        where: {
          status: "joining",
        },
      });
      const useridJoining = dataJoining.map((item) => item.userId);

      let wfhGetApi;
      try {
        wfhGetApi = await firstValueFrom(
          this.http
            .get(this.clientConfigService.wfh.api_url, {
              headers: {
                securitycode: process.env.WFH_API_KEY_SECRET,
              },
            })
            .pipe((res) => res)
        );
      } catch (error) {
        console.log(error);
      }

      if (!wfhGetApi || wfhGetApi.data == undefined) {
        return;
      }
      const wfhUserEmail = wfhGetApi.data.result.map((item) =>
        this.utilsService.getUserNameByEmail(item.emailAddress)
      );

      if (
        (Array.isArray(wfhUserEmail) && wfhUserEmail.length === 0) ||
        !wfhUserEmail
      ) {
        return;
      }

      const userWfhWithSomeCodition = await this.userRepository
        .createQueryBuilder("user")
        .innerJoin("komu_msg", "m", "user.last_message_id = m.id")
        .where(
          userOff && userOff.length > 0 ? '"email" IN (:...userOff)' : "true",
          {
            userOff: userOff,
          }
        )
        .andWhere(
          useridJoining && useridJoining.length > 0
            ? '"email" NOT IN (:...useridJoining)'
            : "true",
          {
            useridJoining: useridJoining,
          }
        )
        .andWhere('"deactive" IS NOT True')
        .andWhere('("roles_discord" @> :intern OR "roles_discord" @> :staff)', {
          intern: ["INTERN"],
          staff: ["STAFF"],
        })
        .andWhere('"last_message_id" IS Not Null')
        .andWhere('"last_bot_message_id" IS Not Null')
        .select("*")
        .execute();

      const coditionGetTimeStamp = (user) => {
        let result = false;
        if (!user.message_bot_timestamp || !user.message_timestamp) {
          result = true;
        } else {
          if (
            Date.now() - user.message_bot_timestamp >= 1800000 &&
            Date.now() - user.message_timestamp >= 1800000
          ) {
            result = true;
          }
        }
        return result;
      };
      const arrayUser = userWfhWithSomeCodition.filter((user) =>
        coditionGetTimeStamp(user)
      );
      try {
        await Promise.all(
          arrayUser.map((userWfh) =>
            this.sendQuizToSingleUserService.sendQuizToSingleUser(
              client,
              userWfh,
              true,
              null
            )
          )
        );
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async punish(client) {
    if (await this.utilsService.checkHoliday()) return;
    if (this.utilsService.checkTime(new Date())) return;
    let wfhGetApi;
    try {
      wfhGetApi = await firstValueFrom(
        this.http
          .get(this.clientConfigService.wfh.api_url, {
            headers: {
              securitycode: process.env.WFH_API_KEY_SECRET,
            },
          })
          .pipe((res) => res)
      );
    } catch (error) {
      console.log(error);
    }

    if (!wfhGetApi || wfhGetApi.data == undefined) {
      return;
    }
    const wfhUserEmail = wfhGetApi.data.result.map((item) =>
      this.utilsService.getUserNameByEmail(item.emailAddress)
    );

    const users = await this.userRepository
      .createQueryBuilder("user")
      .innerJoin("komu_msg", "m", "user.last_message_id = m.id")
      .where(
        wfhUserEmail && wfhUserEmail.length > 0
          ? '"email" IN (:...wfhUserEmail)'
          : "true",
        {
          wfhUserEmail: wfhUserEmail,
        }
      )
      .andWhere('"deactive" IS NOT True')
      .andWhere('"roles_discord" IS Not Null')
      .andWhere('"botPing" = :botPing', {
        botPing: true,
      })
      .andWhere('"last_bot_message_id" IS NOT Null')
      .select("*")
      .execute();

    console.log("sendmachleo", users);
    users.map(async (user) => {
      if (
        Date.now() - user.createdTimestamp >= 1800000 &&
        user.createdTimestamp <=
          this.utilsService.getTimeToDay(null).firstDay.getTime() &&
        user.createdTimestamp >=
          this.utilsService.getTimeToDay(null).lastDay.getTime()
      ) {
        const content = `<@${
          user.userId
        }> không trả lời tin nhắn WFH lúc ${moment(
          parseInt(user.createdTimestamp.toString())
        )
          .utcOffset(420)
          .format("YYYY-MM-DD HH:mm:ss")} !\n`;
        const userInsert = await this.userRepository.findOne({
          where: {
            userId: user.userId,
          },
        });
        const data = await this.wfhRepository.save({
          user: userInsert,
          wfhMsg: content,
          complain: false,
          pmconfirm: false,
          status: "ACTIVE",
          type: "wfh",
          createdAt: Date.now(),
        });
        const message = this.komubotrestService.getWFHWarninghMessage(
          content,
          user.userId,
          data.id
        );
        const channel = await client.channels.fetch(
          process.env.KOMUBOTREST_MACHLEO_CHANNEL_ID
        );
        await this.userRepository
          .createQueryBuilder("user")
          .update(User)
          .set({
            botPing: false,
          })
          .where(`"userId" = :userId`, { userId: user.userId })
          .andWhere(`"deactive" IS NOT TRUE`)
          .execute();
        console.log("update botping punish", user.userId);
        await channel.send(message).catch(console.error);
      }
    });
  }
}