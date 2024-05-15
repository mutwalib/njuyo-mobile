export const formatTime = time => {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const friendlyTime = `${hours12}:${formattedMinutes} ${amOrPm}`;
  return friendlyTime;
};
export const formatDate = dateString => {
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};
export const getStatusColor = status => {
  switch (status) {
    case 'Cancelled':
      return 'red';
    case 'Received':
      return 'green';
    case 'Rejected':
      return 'gray';
    case 'Scheduled':
      return 'blue';
    case 'Inspected':
      return 'purple';
    default:
      return 'teal';
  }
};
export const getStatusTextColor = status => {
  switch (status) {
    case 'Cancelled':
      return 'red';
    case 'Received':
      return 'yellow';
    case 'Rejected':
      return 'gray';
    case 'Scheduled':
      return 'blue';
    default:
      return 'green';
  }
};
const Helper = {};
export default Helper;
