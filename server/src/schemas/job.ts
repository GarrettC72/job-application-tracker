import { GraphQLError } from "graphql";
import gql from "graphql-tag";

import { Resolvers } from "../__generated__/resolvers-types";
import Job from "../models/job";
import { toNewJob } from "../utils/parser";
import { verifyCurrentUser } from "../utils/userHelper";

export const typeDef = gql`
  type Activity {
    activityType: String!
    date: String!
    description: String!
  }

  input ActivityInput {
    activityType: String!
    date: String!
    description: String!
  }

  type Job {
    id: ID!
    companyName: String!
    jobTitle: String!
    companyWebsite: String!
    jobPostingLink: String!
    contactName: String!
    contactTitle: String!
    activities: [Activity!]!
    notes: String!
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
      companyWebsite: String!
      jobPostingLink: String!
      contactName: String!
      contactTitle: String!
      activities: [ActivityInput!]!
      notes: String!
    ): Job
  }
`;

export const resolvers: Resolvers = {
  Query: {
    allJobs: async (_root, _args, { currentUser }) => {
      const user = verifyCurrentUser(currentUser);
      return Job.find({ user: user._id });
    },
    getJob: async (_root, { id }, { currentUser }) => {
      const user = verifyCurrentUser(currentUser);
      const job = await Job.findById(id);

      if (!job) {
        throw new GraphQLError("Job could not be found", {
          extensions: { code: "JOB_NOT_FOUND" },
        });
      }
      if (job.user.toString() !== user._id.toString()) {
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
      const user = verifyCurrentUser(currentUser);
      const date = new Date();
      let newJob;

      try {
        newJob = toNewJob({
          companyName,
          jobTitle,
          companyWebsite,
          jobPostingLink,
          contactName,
          contactTitle,
          activities,
          notes,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
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
      }

      const job = new Job({
        ...newJob,
        dateCreated: date,
        lastModified: date,
        user: user._id,
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
