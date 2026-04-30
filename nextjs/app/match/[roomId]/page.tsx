"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";
import MatchBoard from "@/components/MatchBoard";
import { useUser } from "@/hooks/useUser";
import { PlayerSide } from "@/types/game";

export default function OnlineMatchPage() {
	const params = useParams();
	const roomId = params.roomId as string;
	const [socket, setSocket] = useState<Socket | null>(null);
	const [wsStatus, setWsStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
	const [mySide, setMySide] = useState<PlayerSide>("spectator");
	const [initialMessages, setInitialMessages] = useState<any[]>([]);
	const userId = useUser();

	useEffect(() => {
		// スクロール禁止を強力に適用
		const html = document.documentElement;
		const body = document.body;
		html.style.overflow = "hidden";
		body.style.overflow = "hidden";
		html.style.height = "100%";
		body.style.height = "100%";

		const s = getSocket();
		const onConnect = () => {
			setWsStatus("connected");
			s.emit("joinRoom", {
				roomId: roomId,
				isPlayer: true,
				userId: userId
			});
		};

		if (s.connected) {
			onConnect();
		} else {
			s.on("connect", onConnect);
		}

		s.on("disconnect", () => {
			setWsStatus("disconnected");
		});

		s.on("roomState", (state: { players: { socketId: string, userId?: string, side: "b" | "w" }[], messages?: any[] }) => {
			const me = state.players.find((p) =>
				(userId && p.userId === userId) || p.socketId === s.id
			);
			if (me) {
				setMySide(me.side === "b" ? "sente" : "gote");
			} else {
				setMySide("spectator");
			}
			if (state.messages) {
				setInitialMessages(state.messages);
			}
		});

		setSocket(s);

		return () => {
			// クリーンアップ（元に戻す）
			html.style.overflow = "";
			body.style.overflow = "";
			html.style.height = "";
			body.style.height = "";
			s.off("connect", onConnect);
			s.off("disconnect");
			s.off("roomState");
		};
	}, [roomId, userId]);

	return (
		<>
			{/* 標準のstyleタグを使用して確実にフッターを消す */}
			<style dangerouslySetInnerHTML={{ __html: `
				footer.site-footer {
					display: none !important;
				}
				body {
					position: fixed;
					width: 100%;
				}
			` }} />
			<MatchBoard
				roomId={roomId}
				socket={socket}
				wsStatus={wsStatus}
				mySide={mySide}
				isPreparing={wsStatus === "connecting"}
				initialMessages={initialMessages}
			/>
		</>
	);
}
