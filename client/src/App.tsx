import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useSubscription } from "@apollo/client";

import {
  LoginPage,
  SignUpPage,
  VerificationPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  JobListPage,
  AddJobPage,
  EditJobPage,
  AuthenticatedLayout,
  UnauthenticatedLayout,
  SharedLayout,
} from "./components";
import { getFragmentData } from "./__generated__/fragment-masking";
import { addJobToCache, removeJobFromCache } from "./utils/cache";
import { useAppSelector } from "./app/hooks";
import { JOB_ADDED, JOB_DELETED, JOB_UPDATED } from "./graphql/subscriptions";
import { FULL_JOB_DETAILS, JOB_DETAILS } from "./graphql/fragments";
import useInitialization from "./hooks/useInitialization";
import useNotification from "./hooks/useNotification";

const App = () => {
  const initializeState = useInitialization();
  const notifyWith = useNotification();

  const user = useAppSelector(({ user }) => user);

  useEffect(() => {
    initializeState();
  }, [initializeState]);

  useSubscription(JOB_ADDED, {
    skip: !user,
    onData: ({ data, client }) => {
      if (data.data) {
        const jobAdded = data.data.jobAdded;
        const jobFragment = getFragmentData(JOB_DETAILS, jobAdded);
        if (user && user.email === jobAdded.user.email) {
          notifyWith(
            `New job '${jobFragment.jobTitle} at ${jobFragment.companyName}' was added`,
            "success"
          );
          addJobToCache(client.cache, jobAdded);
        } else {
          removeJobFromCache(client.cache, jobFragment.id);
        }
      }
    },
  });

  useSubscription(JOB_UPDATED, {
    skip: !user,
    onData: ({ data, client }) => {
      if (data.data) {
        const jobUpdated = data.data.jobUpdated;
        const jobFragment = getFragmentData(FULL_JOB_DETAILS, jobUpdated);
        if (user && user.email === jobUpdated.user.email) {
          notifyWith(
            `Job '${jobFragment.jobTitle} at ${jobFragment.companyName}' was updated`,
            "success"
          );
          const id = client.cache.identify({
            __typename: "Job",
            id: jobFragment.id,
          });
          client.cache.evict({ id, fieldName: "user" });
        } else {
          removeJobFromCache(client.cache, jobFragment.id);
        }
      }
    },
  });

  useSubscription(JOB_DELETED, {
    skip: !user,
    onData: ({ data, client }) => {
      if (data.data) {
        const jobDeleted = data.data.jobDeleted;
        removeJobFromCache(client.cache, jobDeleted.id);
        if (user && user.email === jobDeleted.user.email) {
          notifyWith(
            `Job '${jobDeleted.jobTitle} at ${jobDeleted.companyName}' was deleted`,
            "success"
          );
        }
      }
    },
  });

  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route element={<AuthenticatedLayout />}>
          <Route index element={<JobListPage />} />
          <Route path="create" element={<AddJobPage />} />
          <Route path="jobs/:id" element={<EditJobPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>
        <Route element={<UnauthenticatedLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="verify" element={<VerificationPage />} />
          <Route path="forgot" element={<ForgotPasswordPage />} />
          <Route path="reset" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
