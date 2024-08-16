import { Enums } from "@cornerstonejs/core";

import { ViewerCreator } from "../ViewerCreator";
import { renderingViewerEngine } from "../renderEngine";

import type {
  Types,
  RenderingEngine as CornerstoneRenderingEngine,
} from "@cornerstonejs/core";

export class RenderingStackViewport extends ViewerCreator {
  private renderingEngine: CornerstoneRenderingEngine;
  private viewport: StackViewport | null;
  private viewportId: string;

  constructor(viewportId: string) {
    super();

    this.viewport = null;
    this.viewportId = viewportId;
    this.renderingEngine = renderingViewerEngine;
  }

  private enableViewportElement = (element: HTMLDivElement) => {
    this.renderingEngine.enableElement({
      type: Enums.ViewportType.STACK,
      element,
      viewportId: this.viewportId,
    });
  };

  private render = (): void => {
    if (!this.viewport) return;

    this.viewport.render();
  };

  private getViewport = (): StackViewport => {
    return <StackViewport>this.renderingEngine.getViewport(this.viewportId);
  };

  onUnsubscribe = (): void => {
    this.renderingEngine.disableElement(this.viewportId);
  };

  resetViewport = (): void => {
    if (!this.viewport) return;

    this.viewport.resetCamera();
    this.viewport.resetProperties();
  };

  getImage = (): Image => {
    const currentViewport = <StackViewport>(
      this.renderingEngine.getViewport(this.viewportId)
    );

    return currentViewport.getCornerstoneImage();
  };

  setStack = async ({
    imageIds,
    currentImageIdIndex,
  }: {
    imageIds: Array<string>;
    currentImageIdIndex?: number;
  }): Promise<string | undefined> => {
    if (!this.viewport) return;

    const currentImageId = await this.viewport.setStack(
      imageIds,
      currentImageIdIndex
    );

    return currentImageId;
  };

  init = async (element: HTMLDivElement, imageIds: string[]): Promise<void> => {
    this.enableViewportElement(element);
    this.viewport = this.getViewport();

    await this.setStack({ imageIds });
    this.render();
  };

  getSnapshot = (): StackViewport | null => {
    return this.viewport;
  };
}

// Types
export type ViewportInput = Types.PublicViewportInput;
export type StackViewport = Types.IStackViewport;
export type Image = Types.IImage;
