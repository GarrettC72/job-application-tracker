import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
import gql from "graphql-tag";

import { Resolvers } from "../__generated__/resolvers-types";
import { toNewJob } from "../utils/parser";
import { verifyCurrentUser } from "../utils/userHelper";
import { UserDetails } from "../types";
import Job from "../models/job";

const pubsub = new PubSub();

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

  type UserDetails {
    id: ID!
    email: String!
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
    latestActivity: String!
    user: UserDetails!
  }

  input JobMutationInput {
    companyName: String!
    jobTitle: String!
    companyWebsite: String!
    jobPostingLink: String!
    contactName: String!
    contactTitle: String!
    activities: [ActivityInput!]!
    notes: String!
  }

  extend type Query {
    allJobs: [Job!]!
    getJob(id: ID!): Job
  }

  extend type Mutation {
    addJob(jobParams: JobMutationInput!): Job
    updateJob(id: ID!, jobParams: JobMutationInput!): Job
    deleteJob(id: ID!): Job
  }

  extend type Subscription {
    jobAdded: Job!
  }
`;

export const resolvers: Resolvers = {
  Job: {
    latestActivity: (root) => {
      if (root.activities.length === 0) {
        return "";
      }

      const activity = root.activities.reduce((result, activity) => {
        return new Date(activity.date).getTime() -
          new Date(result.date).getTime() >=
          0
          ? activity
          : result;
      }, root.activities[0]);

      return activity.activityType;
    },
  },
  Query: {
    allJobs: async (_root, _args, { currentUser }) => {
      try {
        const user = verifyCurrentUser(currentUser);
        return Job.find({ user: user._id })
          .sort("-dateCreated -_id")
          .populate<{ user: UserDetails }>("user", { email: 1 });
      } catch {
        return [];
      }
    },
    getJob: async (_root, { id }, { currentUser }) => {
      const user = verifyCurrentUser(currentUser);
      const job = await Job.findById(id).populate<{ user: UserDetails }>(
        "user",
        { email: 1 }
      );

      if (!job) {
        throw new GraphQLError("Job could not be found", {
          extensions: { code: "JOB_NOT_FOUND" },
        });
      }
      if (job.user._id.toString() !== user._id.toString()) {
        throw new GraphQLError("User is not authorized to view this job", {
          extensions: { code: "NOT_PERMITTED" },
        });
      }

      return job;
    },
  },
  Mutation: {
    addJob: async (_root, { jobParams }, { currentUser }) => {
      const user = verifyCurrentUser(currentUser);
      const date = new Date();
      let newJob;

      try {
        newJob = toNewJob(jobParams);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: jobParams,
              error,
            },
          });
        } else {
          throw new GraphQLError("All required fields must be filled in", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: jobParams,
              error,
            },
          });
        }
      }

      const job = new Job(newJob);

      Object.assign(job, {
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
            invalidArgs: jobParams,
            error,
          },
        });
      }

      const addedJob = await Job.findById(job._id).populate<{
        user: UserDetails;
      }>("user", {
        email: 1,
      });

      if (!addedJob) {
        throw new GraphQLError("Failed to save job", {
          extensions: { code: "JOB_NOT_FOUND" },
        });
      }

      void pubsub.publish("JOB_ADDED", { jobAdded: addedJob });

      return addedJob;
    },
    updateJob: async (_root, { id, jobParams }, { currentUser }) => {
      const user = verifyCurrentUser(currentUser);
      const date = new Date();
      const job = await Job.findById(id);
      let jobUpdate;

      if (!job) {
        throw new GraphQLError("Job could not be found", {
          extensions: { code: "JOB_NOT_FOUND" },
        });
      }
      if (job.user.toString() !== user._id.toString()) {
        throw new GraphQLError("User is not authorized to update this job", {
          extensions: { code: "NOT_PERMITTED" },
        });
      }

      try {
        jobUpdate = toNewJob(jobParams);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: jobParams,
              error,
            },
          });
        } else {
          throw new GraphQLError("All required fields must be filled in", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: jobParams,
              error,
            },
          });
        }
      }

      Object.assign(job, jobUpdate, { lastModified: date });

      try {
        await job.save();
      } catch (error: unknown) {
        throw new GraphQLError("Failed to update job", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: jobParams,
            error,
          },
        });
      }

      const addedJob = await Job.findById(job._id).populate<{
        user: UserDetails;
      }>("user", {
        email: 1,
      });

      return addedJob;
    },
    deleteJob: async (_root, { id }, { currentUser }) => {
      const user = verifyCurrentUser(currentUser);
      const job = await Job.findById(id).populate<{ user: UserDetails }>(
        "user",
        { email: 1 }
      );

      if (!job) {
        throw new GraphQLError("Job could not be found", {
          extensions: { code: "JOB_NOT_FOUND" },
        });
      }
      if (job.user._id.toString() !== user._id.toString()) {
        throw new GraphQLError("User is not authorized to delete this job", {
          extensions: { code: "NOT_PERMITTED" },
        });
      }

      await job.deleteOne();
      return job;
    },
  },
  Subscription: {
    jobAdded: {
      subscribe: () => ({
        [Symbol.asyncIterator]: () => pubsub.asyncIterator(["JOB_ADDED"]),
      }),
    },
  },
};
