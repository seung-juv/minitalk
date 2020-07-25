import React, { useState, useEffect } from "react";
import { ApolloProvider } from "react-apollo-hooks";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";
import client from "./apollo";
import Chat from "./Chat";

export default function App() {
  const [notificationStatus, setStatus] = useState(false);
  const ask = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log(status);
  };
  useEffect(() => {
    ask();
  }, []);
  return (
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  );
}
