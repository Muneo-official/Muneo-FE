export const SERVICE_UNAVAILABLE_EVENT = 'muneo:service-unavailable';

export const isServiceUnavailableStatus = (status?: number) => status === 502 || status === 503 || status === 504;

export const notifyServiceUnavailable = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SERVICE_UNAVAILABLE_EVENT));
  }
};
