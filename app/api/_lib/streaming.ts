import type { StreamTextResult, ToolSet } from "ai";

interface StreamInfo {
  threadId: string;
  stream: StreamTextResult<ToolSet, never>;
}

export class StreamManager {
  private static instance: StreamManager;
  private streamMap: Map<string, StreamInfo>;

  private constructor() {
    this.streamMap = new Map<string, StreamInfo>();
  }

  public static getInstance(): StreamManager {
    if (!StreamManager.instance) {
      console.log("Creating new StreamManager instance");
      StreamManager.instance = new StreamManager();
    }
    return StreamManager.instance;
  }

  private deleteStreamOnFinish(streamId: string) {
    const info = this.streamMap.get(streamId);
    if (!info) {
      return;
    }
    const { stream, threadId } = info;
    const reader = stream.fullStream.getReader();
    new Promise<void>(async (resolve, reject) => {
      try {
        while (true) {
          const { done } = await reader.read();
          if (done) {
            this.streamMap.delete(streamId);
            // remove streamId from thread.
            break;
          }
        }
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      } finally {
        reader.releaseLock();
      }
    });
  }

  public addStream(
    streamId: string,
    stream: StreamTextResult<ToolSet, never>,
    threadId: string,
  ) {
    this.streamMap.set(streamId, {
      threadId,
      stream,
    });
    this.deleteStreamOnFinish(streamId);
  }

  public getStream(streamId: string): StreamInfo | undefined {
    return this.streamMap.get(streamId);
  }

  public deleteStream(streamId: string) {
    this.streamMap.delete(streamId);
  }

  public getStreamMap() {
    return this.streamMap;
  }
}
