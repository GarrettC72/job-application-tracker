import { useAppSelector } from '../app/hooks';

const Notification = () => {
  const notification = useAppSelector(({ notification }) => notification);

  if (!notification.message) return null;

  const style = {
    color: notification.type === 'error' ? 'red' : 'green',
  };

  return <div style={style}>{notification.message}</div>;
};

export default Notification;
