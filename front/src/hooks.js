import {useEffect, useLayoutEffect, useState} from "react";
import {api} from "./utils";

export function useWindowSize() {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    function updateSize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return width;
}

const connectedInfos = {};

export const useConnected = () => {
  const [connected, setConnected] = useState(connectedInfos.connected || false);
  const [account, setAccount] = useState(connectedInfos.account || null);
  const [loading, setLoading] = useState(false);

  // check that the user is connected if he reloads the page
  useEffect(() => {
    if (connectedInfos.connected !== undefined || loading) return;
    (async () => {
      setLoading(true);
      const result = await api('/connected');
      if (result.error) {
        setConnected(false);
        setAccount(null);
        connectedInfos.connected= false;
        connectedInfos.account = null;
      } else {
        setConnected(true);
        setAccount(result);
        connectedInfos.connected = true;
        connectedInfos.account = result;
      }
      setLoading(false);
    })();
  }, []);

  const setConnectedInfos = (connected, account) => {
    connectedInfos.connected = connected;
    connectedInfos.account = account;
    setConnected(connected);
    setAccount(account);
  }

  return {connected, account, setConnectedInfos, loading};
};