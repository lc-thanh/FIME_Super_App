import { CloudflareData } from "@/app/(admin)/dashboard/_components/cloudflare-section";
import envConfig from "@/config";
import http from "@/lib/http";
import {
  TaskStatisticsType,
  UserActionsPaginatedResponseType,
} from "@/schemaValidations/statistic.schema";
import dayjs from "dayjs";

export const StatisticApiRequests = {
  getCloudflareData: async () => {
    const date = dayjs().subtract(31, "day").format("YYYY-MM-DD");

    const query = `
      query {
        viewer {
          zones(filter: {zoneTag: "fecc53f83aa955929127b1242749629d"}) {
            httpRequests1dGroups(
              limit: 30
              orderBy: [date_ASC]
              filter: { date_gt: "${date}" }
            ) {
              dimensions {
                date
              }
              sum {
                requests
              }
            }
          }
        }
      }`;

    return http.post<CloudflareData>(
      "/graphql",
      { query },
      {
        headers: {
          Authorization: `Bearer ${envConfig.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        baseUrl: "https://api.cloudflare.com/client/v4",
      }
    );
  },

  getUserActions: async (params: string) => {
    return http.get<UserActionsPaginatedResponseType>(
      `/statistics/user-actions?${params}`
    );
  },

  getTaskStatistics: async () => {
    return http.get<TaskStatisticsType>("/statistics/task");
  },
};
