"use client";

import { useEffect } from "react";
import AiMatchBoard from "@/components/AiMatchBoard";

export default function AiMatchPage() {
	useEffect(() => {
		// スクロール禁止を強力に適用
		const html = document.documentElement;
		const body = document.body;
		html.style.overflow = "hidden";
		body.style.overflow = "hidden";
		html.style.height = "100%";
		body.style.height = "100%";

		return () => {
			// クリーンアップ
			html.style.overflow = "";
			body.style.overflow = "";
			html.style.height = "";
			body.style.height = "";
		};
	}, []);

	return (
		<>
			{/* AI対戦画面のみフッターを非表示にする */}
			<style dangerouslySetInnerHTML={{ __html: `
				footer.site-footer {
					display: none !important;
				}
				body {
					position: fixed;
					width: 100%;
				}
			` }} />
			<AiMatchBoard mySide="sente" aiDepth={6} />
		</>
	);
}