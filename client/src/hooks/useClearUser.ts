import { useAppDispatch } from "../app/hooks";
import { clearUser } from "../features/user/userSlice";

const useClearUser = () => {
  const dispatch = useAppDispatch();

  return () => {
    dispatch(clearUser());
  };
};

export default useClearUser;
