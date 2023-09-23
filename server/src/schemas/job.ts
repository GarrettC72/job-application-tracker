import { GraphQLError } from "graphql";
import gql from "graphql-tag";

import { Resolvers } from "../__generated__/resolvers-types";
import Job from "../models/job";
import { parseDateParam } from "../utils/parser";

export const typeDef = gql`
  type Activity {
    activityType: String!
    date: String!
    description: String
  }

  input ActivityInput {
    activityType: String!
    date: String!
    description: String
  }

  type Job {
    id: ID!
    companyName: String!
    jobTitle: String!
    companyWebsite: String
    jobPostingLink: String
    contactName: String
    contactTitle: String
    activities: [Activity!]
    notes: String
    dateCreated: Date!
    lastModified: Date!
  }

  extend type Query {
    allJobs: [Job!]
    getJob(id: String!): Job
  }

  extend type Mutation {
    addJob(
      companyName: String!
      jobTitle: String!
      companyWebsite: String
      jobPostingLink: String
      contactName: String
      contactTitle: String
      activities: [ActivityInput!]
      notes: String
    ): Job
  }
`;

export const resolvers: Resolvers = {
  Query: {
    allJobs: async (_root, _args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Must be signed in", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      if (!currentUser.verified) {
        throw new GraphQLError("This user is not verified", {
          extensions: { code: "UNVERIFIED_EMAIL" },
        });
      }

      return Job.find({ user: currentUser._id });
    },
    getJob: async (_root, { id }, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Must be signed in", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      if (!currentUser.verified) {
        throw new GraphQLError("This user is not verified", {
          extensions: { code: "UNVERIFIED_EMAIL" },
        });
      }

      const job = await Job.findById(id);

      if (!job) {
        throw new GraphQLError("Job could not be found", {
          extensions: { code: "JOB_NOT_FOUND" },
        });
      }

      if (job.user.toString() !== currentUser._id.toString()) {
        throw new GraphQLError("User is not authorized to view this job", {
          extensions: { code: "NOT_PERMITTED" },
        });
      }

      return job;
    },
  },
  Mutation: {
    addJob: async (
      _root,
      {
        companyName,
        jobTitle,
        companyWebsite,
        jobPostingLink,
        contactName,
        contactTitle,
        activities,
        notes,
      },
      { currentUser }
    ) => {
      if (!currentUser) {
        throw new GraphQLError("Must be signed in", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      if (!currentUser.verified) {
        throw new GraphQLError("This user is not verified", {
          extensions: { code: "UNVERIFIED_EMAIL" },
        });
      }

      if (activities) {
        for (let i = 0; i < activities.length; i++) {
          const activity = activities[i];
          try {
            parseDateParam(activity.date, "activity.date");
          } catch (error: unknown) {
            throw new GraphQLError(
              "Activity dates are not formatted properly",
              {
                extensions: { code: "BAD_USER_INPUT" },
              }
            );
          }
        }
      }

      const date = new Date();

      const job = new Job({
        companyName,
        jobTitle,
        companyWebsite,
        jobPostingLink,
        contactName,
        contactTitle,
        activities,
        notes,
        dateCreated: date,
        lastModified: date,
        user: currentUser._id,
      });

      try {
        await job.save();
      } catch (error: unknown) {
        throw new GraphQLError("Failed to save job", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: {
              companyName,
              jobTitle,
              companyWebsite,
              jobPostingLink,
              contactName,
              contactTitle,
              activities,
              notes,
            },
            error,
          },
        });
      }

      return job;
    },
  },
};
