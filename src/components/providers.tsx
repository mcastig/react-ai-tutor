"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INDEXED_CORPUS,
  indexLocalDoc,
  type CorpusDoc,
} from "@/lib/corpus";

export type View = "chat" | "knowledge" | "eval";

type CorpusValue = {
  docs: readonly CorpusDoc[];
  lastAdded: CorpusDoc | null;
  addDoc: (fileName: string, text: string) => void;
};

type WorkspaceValue = {
  view: View;
  setView: (view: View) => void;
};

const CorpusContext = createContext<CorpusValue | null>(null);
const WorkspaceContext = createContext<WorkspaceValue | null>(null);

export function useCorpus(): CorpusValue {
  const value = useContext(CorpusContext);
  if (value === null) throw new Error("useCorpus needs AppProviders above it");
  return value;
}

export function useWorkspace(): WorkspaceValue {
  const value = useContext(WorkspaceContext);
  if (value === null) {
    throw new Error("useWorkspace needs AppProviders above it");
  }
  return value;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [docs, setDocs] = useState<readonly CorpusDoc[]>(INDEXED_CORPUS);
  const [lastAdded, setLastAdded] = useState<CorpusDoc | null>(null);
  const [view, setView] = useState<View>("chat");

  const addDoc = useCallback((fileName: string, text: string) => {
    const doc = indexLocalDoc(fileName, text);
    setDocs((current) => [...current, doc]);
    setLastAdded(doc);
  }, []);

  const corpus = useMemo<CorpusValue>(
    () => ({ docs, lastAdded, addDoc }),
    [docs, lastAdded, addDoc],
  );

  const workspace = useMemo<WorkspaceValue>(() => ({ view, setView }), [view]);

  return (
    <CorpusContext.Provider value={corpus}>
      <WorkspaceContext.Provider value={workspace}>
        {children}
      </WorkspaceContext.Provider>
    </CorpusContext.Provider>
  );
}
