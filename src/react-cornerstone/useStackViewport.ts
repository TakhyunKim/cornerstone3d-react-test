import { useRef, useEffect, useCallback, useSyncExternalStore } from "react";

import { ViewerFactory } from "../core";

import type { MappingToolWithKey } from "../core";

interface UseStackViewportParams {
  element: HTMLDivElement | null;
  imageIds: string[];
  tools?: MappingToolWithKey[];
}

export const useStackViewport = ({
  element,
  imageIds,
  tools,
}: UseStackViewportParams) => {
  const viewerFactoryRef = useRef<ViewerFactory | null>(null);

  if (!viewerFactoryRef.current) {
    viewerFactoryRef.current = new ViewerFactory();
  }

  const subscribe = useCallback(
    (listener: () => void) => () =>
      viewerFactoryRef!.current?.subscribe(listener),
    []
  );

  useSyncExternalStore(subscribe, viewerFactoryRef!.current.getSnapshot);

  useEffect(() => {
    const renderingWithInitialSettings = async () => {
      if (viewerFactoryRef.current && element) {
        await viewerFactoryRef.current.init(element, imageIds, tools);
      }
    };

    renderingWithInitialSettings();
  }, [element, imageIds, tools]);
};
