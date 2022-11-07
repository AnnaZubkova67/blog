export default function NetworkState({ onNetworkState }) {
  window.addEventListener('offline', () => {
    onNetworkState();
  });

  window.addEventListener('online', () => {
    onNetworkState();
  });
}
