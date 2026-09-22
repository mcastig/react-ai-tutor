import { AppProviders } from "@/components/providers";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { EvalPanel } from "@/components/panels/EvalPanel";
import { Workspace } from "@/components/panels/Workspace";
import styles from "./page.module.css";

export default function Home() {
  return (
    <AppProviders>
      <div className={styles.shell}>
        <Sidebar />
        <div className={styles.column}>
          <TopBar />
          <main className={styles.stage}>
            <Workspace evalPanel={<EvalPanel />} />
          </main>
        </div>
      </div>
    </AppProviders>
  );
}
