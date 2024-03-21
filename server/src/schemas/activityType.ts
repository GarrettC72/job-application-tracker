import gql from "graphql-tag";

import { Resolvers } from "../__generated__/resolvers-types";
import { ActivityType } from "../types";

export const typeDef = gql`
  enum ActivityType {
    APPLIED
    SENT_RESUME
    ONLINE_ASSESSMENT
    INTERVIEWED
    REJECTED
    CLOSED_FILLED
    RECEIVED_OFFER
    ACCEPTED_OFFER
    DECLINED_OFFER
  }
`;

export const resolvers: Resolvers = {
  ActivityType: {
    APPLIED: ActivityType.APPLIED,
    SENT_RESUME: ActivityType.SENT_RESUME,
    ONLINE_ASSESSMENT: ActivityType.ONLINE_ASSESSMENT,
    INTERVIEWED: ActivityType.INTERVIEWED,
    REJECTED: ActivityType.REJECTED,
    CLOSED_FILLED: ActivityType.CLOSED_FILLED,
    RECEIVED_OFFER: ActivityType.RECEIVED_OFFER,
    ACCEPTED_OFFER: ActivityType.ACCEPTED_OFFER,
    DECLINED_OFFER: ActivityType.DECLINED_OFFER,
  },
};
