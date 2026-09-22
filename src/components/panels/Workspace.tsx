"use client";

import { Activity, type ReactNode } from "react";
import { useWorkspace } from "@/components/providers";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { KnowledgePanel } from "./KnowledgePanel";
import styles from "./panels.module.css";

/**
 * `evalPanel` arrives already rendered from the server, so that view costs no
 * client JavaScript. Chat stays mounted behind Activity — leaving the tab must
 * not throw the conversation away.
 */
export function Workspace({ evalPanel }: { evalPanel: ReactNode }) {
  const { view } = useWorkspace();

  return (
    <div className={styles.frame}>
      <Activity mode={view === "chat" ? "visible" : "hidden"}>
        <ChatPanel />
      </Activity>
      {view === "knowledge" ? <KnowledgePanel /> : null}
      {view === "eval" ? evalPanel : null}
    </div>
  );
}
