import { useReducer /*, useState*/ } from "react";
import { Activity, ActivityTypeValue } from "../types";

interface JobFormFields {
  companyName: string;
  companyWebsite: string;
  jobTitle: string;
  jobPostingLink: string;
  contactName: string;
  contactTitle: string;
  activities: Activity[];
  notes: string;
}

interface TextFieldPayload {
  name: string;
  value: string;
}

interface ActivityFieldPayload {
  name: string;
  value: string;
  index: number;
}

interface EditTextFieldAction {
  type: "edit_text_field";
  payload: TextFieldPayload;
}

interface AddActivityAction {
  type: "add_activity";
}

interface RemoveActivityAction {
  type: "remove_activity";
  payload: number;
}

interface EditActivityAction {
  type: "edit_activity";
  payload: ActivityFieldPayload;
}

type JobFormFieldsAction =
  | EditTextFieldAction
  | AddActivityAction
  | RemoveActivityAction
  | EditActivityAction;

const defaultState = {
  companyName: "",
  companyWebsite: "",
  jobTitle: "",
  jobPostingLink: "",
  contactName: "",
  contactTitle: "",
  activities: [],
  notes: "",
};

const reducer = (state: JobFormFields, action: JobFormFieldsAction) => {
  switch (action.type) {
    case "edit_text_field":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "add_activity":
      return {
        ...state,
        activities: state.activities.concat({
          activityType: ActivityTypeValue.APPLIED,
          date: "",
          description: "",
        }),
      };
    case "remove_activity": {
      const newActivities = state.activities.slice();
      newActivities.splice(action.payload, 1);
      return {
        ...state,
        activities: newActivities,
      };
    }
    case "edit_activity": {
      return {
        ...state,
        activities: state.activities.map((activity, i) =>
          i === action.payload.index
            ? { ...activity, [action.payload.name]: action.payload.value }
            : activity
        ),
      };
    }
    default:
      throw new Error();
  }
};

const useJobForm = (fields?: JobFormFields) => {
  // const [jobFormFields, setJobFormFields] = useState<JobFormFields>(
  //   fields ?? {
  //     companyName: "",
  //     companyWebsite: "",
  //     jobTitle: "",
  //     jobPostingLink: "",
  //     contactName: "",
  //     contactTitle: "",
  //     activities: [],
  //     notes: "",
  //   }
  // );
  const jobFormFieldsReducer = useReducer(reducer, fields ?? defaultState);

  // const editTextField = (
  //   event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = event.target;
  //   setJobFormFields((prevFields) => {
  //     return {
  //       ...prevFields,
  //       [name]: value,
  //     };
  //   });
  // };

  // const addActivity = () => {
  //   setJobFormFields((prevFields) => {
  //     return {
  //       ...prevFields,
  //       acitivities: prevFields.activities.concat({
  //         activityType: ActivityTypeValue.APPLIED,
  //         date: "",
  //         description: "",
  //       }),
  //     };
  //   });
  // };

  // const removeActivity = (index: number) => {
  //   setJobFormFields((prevFields) => {
  //     const newActivities = prevFields.activities.slice();
  //     newActivities.splice(index, 1);
  //     return {
  //       ...prevFields,
  //       activities: newActivities,
  //     };
  //   });
  // };

  // const editActivity = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   index: number
  // ) => {
  //   const { name, value } = event.target;
  //   setJobFormFields((prevFields) => {
  //     return {
  //       ...prevFields,
  //       activities: prevFields.activities.map((activity, i) =>
  //         i === index ? { ...activity, [name]: value } : activity
  //       ),
  //     };
  //   });
  // };

  return jobFormFieldsReducer;
};

export default useJobForm;
