import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateTap } from "@/lib/service/mutationHelper";
import { getUserCard } from "@/lib/service/queryHelper";
import { userKeys } from "@/lib/service/keysHelper";

import SERVER_SETTINGS from "@/lib/serverSettings";
import AuthenticatedLayout from "@/components/layout/layout";
import { useSession } from "next-auth/react";

interface Card {
  restaurantId: string;
  // Add other card properties as needed
}

interface TapScanData {
  // data: {
  restaurantId: string;
  increment: number;
  bonus?: {
    name: string;
  };
  // };
}

interface QrCodeData {
  data: {
    data: {
      encryptedData: string;
    };
  };
}

const MyQrPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [qrData, setQrdata] = useState<string>("");
  const [socketStatus, setSocketStatus] = useState<string>("Initializing...");
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.userId as string | undefined;
  const socketRef = useRef<Socket | null>(null);

  const { data: cardsData } = useQuery({
    queryKey: userKeys.cards,
    queryFn: () => getUserCard(),
    enabled: !!userId,
  });

  const cards: Card[] = cardsData?.data?.cards ?? [];

  const handleTapScan = useCallback(
    (data: TapScanData) => {
      console.log("Tap scan emitted: ", data);
      const userCard = cards.find(
        (card) => card.restaurantId === data.restaurantId
      );
      console.log("🚀 ~ userCard:", userCard);
      if (!userCard) {
        router.push(`/restaurants/${data.restaurantId}`);
      } else {
        console.log("no user card");
        //TODO implement perk screen
      }
    },
    [cards, router]
  );

  const { mutateAsync: createTapMutation } = useMutation<QrCodeData, Error>({
    mutationFn: generateTap,
    onSuccess: async (data) => {
      try {
        const newQrdata = data.data.data.encryptedData;
        setQrdata(newQrdata);
        setLoading(false);
      } catch (error) {
        console.error("Redeem mutation failed:", error);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    setLoading(true);
    setSocketStatus("Initializing socket...");

    console.log("Attempting to connect to:", SERVER_SETTINGS.SOCKET_URL);

    const socket = io(SERVER_SETTINGS.SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    const onConnect = () => {
      console.log("Connected to server");
      setSocketStatus("Connected");
      if (userId) {
        console.log("Emitting register event with userId:", userId);
        socket.emit("register", userId);
      } else {
        console.log("No userId available for registration");
      }
    };

    const onConnectError = (error: Error) => {
      console.error("Connection error:", error);
      setSocketStatus(`Connection error: ${error.message}`);
    };

    const onDisconnect = (reason: string) => {
      console.log("Disconnected:", reason);
      setSocketStatus(`Disconnected: ${reason}`);
    };

    const onTapScan = (data: TapScanData) => {
      console.log("Tap scan received:", data);
      handleTapScan(data);
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("disconnect", onDisconnect);
    socket.on("tap-scan", onTapScan);

    if (userId) {
      createTapMutation().catch((error) => {
        console.error("Failed to create tap:", error);
        setLoading(false);
      });
    } else {
      console.log("No userId available, skipping createTapMutation");
      setLoading(false);
    }

    return () => {
      console.log("Cleaning up socket connection");
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("disconnect", onDisconnect);
      socket.off("tap-scan", onTapScan);
      socket.disconnect();
    };
  }, [userId, handleTapScan, createTapMutation]);

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md text-gray100">
          <div className="flex flex-col items-center p-6 space-y-6">
            <h2 className="text-2xl font-bold text-white">My QR Code</h2>
            <p className="text-sm text-gray-400">
              Socket status: {socketStatus}
            </p>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-qrGradientStart to-qrGradientEnd p-8 rounded-lg">
                  <QRCodeCanvas
                    value={`data:image/png;base64,${qrData}`}
                    size={250}
                    bgColor="transparent"
                    fgColor="#ffffff"
                    level="H"
                  />
                </div>
                <p className="text-center text-gray100 text-md">
                  Show this to your waiter to check-in. Do not worry, they are
                  pros.
                </p>
              </>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={() => router.back()}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </AuthenticatedLayout>
  );
};

export default MyQrPage;
