import { toast } from 'react-toastify';

const toastConfig = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export const showSuccessToast = (message) => {
  toast.success(message, toastConfig);
};

export const showErrorToast = (message) => {
  toast.error(message, toastConfig);
};

export const showInfoToast = (message) => {
  toast.info(message, toastConfig);
};

export const showWarningToast = (message) => {
  toast.warn(message, toastConfig);
};
