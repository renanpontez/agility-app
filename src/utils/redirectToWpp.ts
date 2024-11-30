export const redirectToWpp = (phoneNumber: string, message?: string) => {
  if (message) {
    const encondedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encondedMessage}`;
    return window.open(url, '_blank');
  } else {
    const url = `https://wa.me/${phoneNumber}`;
    return window.open(url, '_blank');
  }
};
